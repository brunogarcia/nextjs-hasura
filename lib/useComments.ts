import { useState, useEffect } from "react";
import http from "./httpClient";

const getCommentsQuery = `
query GetComments($topic: String!) {
  comments(where: {topic: {_eq: $topic}}, order_by: {created_at: desc}) {
    id
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
  id: number;
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

export const useComments = (topic: string): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchComments = () => {
    setLoading(true);

    const req = JSON.stringify({
      query: getCommentsQuery,
      variables: {
        topic,
      },
    });

    http.post("v1/graphql", req)
    .then(({ data }) => {
      if (data.errors && data.errors.length) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }

      setComments(data.data.comments);
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

    const req = JSON.stringify({
      query: addCommentMutation,
      variables: {
        topic,
        author,
        content,
      },
    });

    http.post("v1/graphql", req)
    .then(({ data }) => {
      if (data.errors && data.errors.length) {
        setError(data.errors[0].message);
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
