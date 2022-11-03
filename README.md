# Full Stack Comments with Hasura and React

Build and implement a comprehensive commenting system for your website using Hasura and React. Use the commenting feature to teach technology concepts like Hasura with appropriate authorization, optimistic updates for a more responsive UI, and pagination.

Following the instructions of the course [Full Stack Comments with Hasura and React](https://www.newline.co/courses/newline-guide-to-fullstack-comments-with-hasura-and-react).

## Generated blog example using Next.js, Markdown, and TypeScript

This is the existing [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) plus TypeScript.

This example showcases Next.js's [Static Generation](https://nextjs.org/docs/basic-features/pages) feature using Markdown files as the data source.

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

To create the blog posts we use [`remark`](https://github.com/remarkjs/remark) and [`remark-html`](https://github.com/remarkjs/remark-html) to convert the Markdown files into an HTML string, and then send it down as a prop to the page. The metadata of every post is handled by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in props to the page.

## How to use

```bash
npm run dev
```
