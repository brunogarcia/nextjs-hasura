import { useState } from 'react';

import PostComment from './post-comment'
import PostAddComment from './post-add-comment'
import { useComments } from '../hooks/useComments'

type Props = {
  topic: string;
}

export default function PostComments({ topic }: Props) {
  const limit = 2;

  const [offset, setOffset] = useState(0);
  const prevPage = () => setOffset(offset - limit);
  const nextPage = () => setOffset(offset + limit);

  const {
    count,
    error,
    adding,
    loading,
    comments,
    addComment
  } = useComments(topic, { limit, offset })

  return (
    <>
      <PostAddComment adding={adding} addComment={addComment} />
      <section className="pt-6 max-w-2xl mx-auto">
        {
          loading ? <p className="h-96 min-h-full text-grey-500">Loading comments...</p>
          : error ? <p className="h-96 min-h-full text-red-500">Error loading comments</p>
          : <div className='h-96 min-h-full'>
              <h3 className="font-bold text-xm">
                {count === 1 ? "1 comment" : `${count} comments`}
              </h3>

              <div>
                {
                comments.length > 0
                  ? comments.map((comment, index) => <PostComment key={index} {...comment} />)
                  : <p className="text-grey-500">No comments yet</p>
                }
              </div>

              <nav className="flex items-center justify-between pt-6">
                <p className="text-sm text-gray-700">Page: {Math.ceil(count)}</p>
                <div className="flex justify-between">
                  <button
                    disabled={offset === 0}
                    onClick={prevPage}
                    className="items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    disabled={offset + limit > count}
                    onClick={nextPage}
                    className="ml-3 items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </nav>
            </div>
        }
      </section>
    </>
  );
}
