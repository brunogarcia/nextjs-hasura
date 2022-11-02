import { useComments } from '../lib/useComments'
import PostComment from './post-comment'

type Props = {
  slug: string
}

export default function PostComments({ slug }: Props) {
  const { comments, loading, error } = useComments(process.env.NEXT_PUBLIC_HASURA_URL, slug)

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
              { comments.map((comment) => <PostComment {...comment} />) }
            </div>
          </>
      }
    </section>
  );
}