import { useState } from "react";
import Spinner from './spinner'
import type { Comment, AddComment } from '../lib/useComments'

type Props = {
  adding: boolean;
  addComment: AddComment;
}

export default function PostAddComment({ adding, addComment }: Props) {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  const disableSubmit = adding || username.length === 0 || comment.length === 0;

  const onSubmit = ({ content, author }: Pick<Comment, "content" | "author">) => {
    addComment({ content, author });
    setUsername("");
    setComment("");
  };

  return (
    <form
      className="mb-8 pt-6 max-w-2xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ content: comment, author: username });
      }}
    >
      <div className="mb-4">
        <label
          className="block text-gray-600 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Name
        </label>
        <input
          id="username"
          className="border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          placeholder="Jon Snow"
          disabled={adding}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-600 text-sm font-bold mb-2"
          htmlFor="comment"
        >
          Comment
        </label>
        <textarea
          id="comment"
          className="border rounded w-full py-2 px-3 text-gray-700"
          rows={2}
          placeholder="Tell me what you think 😊"
          value={comment}
          disabled={adding}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={disableSubmit}
        className="disabled:opacity-20 bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
      >
        {
         adding ? (
          <Spinner>
            <span>Sending</span>
            </Spinner>
          ) :  "Add comment"
        }
      </button>
    </form>
  )
}
