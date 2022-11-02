import PostComment from './post-comment'
import type { Comment } from '../lib/useComments'

type Props = {
  error: string | null
  loading: boolean
  comments: Comment[]
}

export default function PostComments({ comments, loading, error }: Props) {
  return (
    <section className="pt-6 max-w-2xl mx-auto">
      {
        loading ? <p className="text-grey-500">Loading comments...</p>
        : error ? <p className="text-red-500">Error loading comments</p>
        : <>
            <h3 className="font-bold text-xm">
              {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
            </h3>
            <div>
              {comments.map((comment) => <PostComment key={comment.created_at} {...comment} />)}
            </div>
          </>
      }
    </section>
  );
}