import type { Comment } from '../hooks/useComments'

export default function PostComments(comment: Comment) {
  const { author, content, status, created_at } = comment

  return (
    <article className="bg-gray-100 rounded my-6">
      <div className="px-6 py-4">
        <div className="font-bold text-xm mb-2">
          {author} ・ {new Date(created_at).toLocaleDateString()}
          {status ? ` ・ ${status}` : null}
        </div>
        <p className="text-gray-700 text-base">{content}</p>
      </div>
    </article>
  );
}
