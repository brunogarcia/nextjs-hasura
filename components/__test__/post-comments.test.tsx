import user from "@testing-library/user-event";
import { render, waitFor } from "@testing-library/react";

import PostComments from "../post-comments";

describe(PostComments, () => {
  describe(PostComments, () => {
    it("renders existing comments from API", async () => {
      const { findByText } = render(
        <PostComments postSlug="test" />
      );

      await findByText("Just testing");
      await findByText(/Bruno/);

      await findByText("Testing some more");
      await findByText(/Eva/);

      await findByText("2 comments");
    });

    it("renders a new comment when added", async () => {
      const { findByText, findByLabelText } = render(
        <PostComments postSlug="test" />
      );

      const nameInput = await findByLabelText("Name");
      const textarea = await findByLabelText("Comment");
      const button = await findByText("Add comment");

      user.type(nameInput, "Tester");
      user.type(textarea, "What's up?");
      user.click(button);

      await waitFor(async () => {
        await findByText(/Loading comments/);
      });
    });
  });
});
