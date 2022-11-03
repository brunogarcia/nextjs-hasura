import { graphql } from "msw";

import { type Comment, CommentStatus } from "../../lib/useComments";

const comments: Comment[] = [
  {
    topic: "test",
    author: "Bruno",
    content: "Just testing",
    status: CommentStatus.Added,
    created_at: new Date().toString(),
  },
  {
    topic: "dogs",
    author: "Eva",
    content: "What a cute dog!",
    status: CommentStatus.Added,
    created_at: new Date().toString(),
  },
  {
    topic: "test",
    author: "Eva",
    content: "Testing some more",
    status: CommentStatus.Added,
    created_at: new Date().toString(),
  },
];

export const handlers = [
  graphql.query("GetComments", (req, res, ctx) => {
    return res(
      ctx.data({
        comments: comments.filter((c) => c.topic === req.variables.topic),
      })
    );
  }),
  graphql.mutation("AddComment", (req, res, ctx) => {
    const { author, content, topic } = req.variables;
    const comment = {
      topic,
      author,
      content,
      status: CommentStatus.Added,
      created_at: new Date().toString(),
    };

    comments.push(comment);

    return res(ctx.data({ comment }));
  }),
];
