import PostComment from './post-comment'
import PostAddComment from './post-add-comment'
import { useComments } from '../lib/useComments'

type Props = {
  postSlug: string;
}

export default function PostComments({ postSlug }: Props) {
  const {
    error,
    adding,
    loading,
    comments,
    addComment
  } = useComments(postSlug)

  return (
    <>
      <PostAddComment adding={adding} addComment={addComment} />
      <section className="pt-6 max-w-2xl mx-auto">
        {
          loading ? <p className="text-grey-500">Loading comments...</p>
          : error ? <p className="text-red-500">Error loading comments</p>
          : <>
              <h3 className="font-bold text-xm">
                {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
              </h3>
              <div>
                {comments.map((comment, index) => <PostComment key={index} {...comment} />)}
              </div>
            </>
        }
      </section>
    </>
  );
}
