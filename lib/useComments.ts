import { useEffect, useState } from "react";

export interface Comment {
  topic: string;
  author: string;
  created_at: string;
  content: string;
}

interface UseCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

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

export const useComments = (
  hasuraUrl: string,
  topic: string
): UseCommentsResult => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
  
      try {
        const response = await fetch(hasuraUrl, {
          method: "POST",
          headers: {
            'x-hasura-role': 'anonymous',
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: getCommentsQuery,
            variables: {
              topic,
            },
          }),
        });
        const { data } = await response.json();
        setComments(data.comments);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, []);

  return { comments, loading, error };
}
