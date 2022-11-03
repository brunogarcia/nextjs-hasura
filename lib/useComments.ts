import { useState, useEffect } from "react";
import shallowEqual from "../utils/shallowEqual";
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

export enum CommentStatus {
  Added = "added",
  Adding = "adding",
  Failed = "failed",
}

export interface Comment {
  author: string;
  content: string;
  created_at: string;
  topic: string;
  status: CommentStatus;
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
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);


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
    const newComment: Comment = {
      author,
      content,
      topic,
      status: CommentStatus.Adding,
      created_at: new Date().toISOString(),
    };

    setAdding(true);
    setComments((prev) => [newComment, ...prev]);

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

      setComments((prev) =>
        prev.map((comment) =>
          shallowEqual(comment, newComment)
            ? {
                ...newComment,
                status: CommentStatus.Added,
              }
            : comment
        )
      );

      setAdding(false);
    })
    .catch((err) => {
      setComments((prev) =>
        prev.map((comment) =>
          shallowEqual(comment, newComment)
            ? {
                ...newComment,
                status: CommentStatus.Failed,
              }
            : comment
        )
      );

      setAdding(false);
    });
  };

  useEffect(fetchComments, []);

  return {
    error,
    adding,
    loading,
    comments,
    addComment,
  };
};
