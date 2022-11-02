import { useState, useEffect } from "react";

const getCommentsQuery = `
query GetComments($topic: String!) {
  comments(where: {topic: {_eq: $topic}}, order_by: {created_at: desc}) {
    topic
    author
    content
    created_at
  }
}
`;

const addCommentMutation = `
mutation AddComment($topic: String!, $author: String!, $content: String!) {
  insert_comments_one(
    object: { author: $author, content: $content, topic: $topic }
  ) {
    id
    created_at
  }
}
`;

export interface Comment {
  author: string;
  content: string;
  created_at: string;
  topic: string;
}

export type AddComment = ({
  content,
  author,
}: Pick<Comment, "content" | "author">) => void;

export interface UseCommentsResult {
  loading: boolean;
  adding: boolean;
  error: string | null;
  comments: Comment[];
  addComment: AddComment;
}

export const useComments = (
  hasuraUrl: string,
  topic: string
): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchComments = () => {
    setLoading(true);

    fetch(hasuraUrl, {
      method: "POST",
      headers: {
        "x-hasura-role": "anonymous",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: getCommentsQuery,
        variables: {
          topic,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors && res.errors.length) {
          setError(res.errors[0].message);
          setLoading(false);
          return;
        }
        setComments(res.data.comments);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const addComment = ({
    content,
    author,
  }: Pick<Comment, "content" | "author">) => {
    setAdding(true);

    fetch(hasuraUrl, {
      method: "POST",
      headers: {
        "x-hasura-role": "anonymous",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: addCommentMutation,
        variables: {
          topic,
          content,
          author,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors && res.errors.length) {
          setError(res.errors[0].message);
          setAdding(false);
          return;
        }

        setAdding(false);
        fetchComments();
      })
      .catch((err) => {
        setError(err);
        setAdding(false);
      });
  };

  useEffect(fetchComments, []);

  return {
    error,
    loading,
    adding,
    comments,
    addComment,
  };
};