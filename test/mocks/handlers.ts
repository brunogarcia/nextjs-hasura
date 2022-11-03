import { graphql } from "msw";

import type {
  Comment,
} from "../../lib/useComments";

const comments: Comment[] = [
  {
    id: 1,
    author: "Bruno",
    content: "Just testing",
    created_at: new Date().toString(),
    topic: "test",
  },
  {
    id: 2,
    author: "Eva",
    content: "What a cute dog!",
    created_at: new Date().toString(),
    topic: "dogs",
  },
  {
    id: 3,
    author: "Eva",
    content: "Testing some more",
    created_at: new Date().toString(),
    topic: "test",
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
      id: comments.length + 1,
      topic,
      author,
      content,
      created_at: new Date().toString(),
    };

    comments.push(comment);

    return res(ctx.data({ comment }));
  }),
];
