import { useState, useEffect } from "react";
import http from "../lib/httpClient";
import shallowEqual from "../utils/shallowEqual";

const getCommentsQuery = `
query GetComments($topic: String!, $limit: Int, $offset: Int) {
  comments(
    where: { topic: { _eq: $topic } }
    limit: $limit
    offset: $offset
    order_by: { created_at: desc }
  ) {
    id
    topic
    author
    content
    created_at
  }
  comments_aggregate(where: { topic: { _eq: $topic } }) {
    aggregate {
      count
    }
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
  count: number;
  loading: boolean;
  adding: boolean;
  error: string | null;
  comments: Comment[];
  addComment: AddComment;
}

interface UseCommentConfig { limit?: number, offset?: number }

export const useComments = (topic: string, config?: UseCommentConfig): UseCommentsResult => {
  const [count, setCount] = useState(0);
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
        ...(config?.limit && { limit: config.limit }),
        ...(config?.offset && { offset: config.offset }),
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
      setCount(data.data.comments_aggregate.aggregate.count);
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

  useEffect(fetchComments, [config?.limit, config?.offset]);

  return {
    count,
    error,
    adding,
    loading,
    comments,
    addComment,
  };
};
