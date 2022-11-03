import userEvent from "@testing-library/user-event";
import { render, waitFor } from "@testing-library/react";

import PostComments from "../post-comments";
import React from "react";

function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

describe(PostComments, () => {
  describe(PostComments, () => {
    it("renders existing comments from API", async () => {
      const { findByText } = setup(
        <PostComments postSlug="test" />
      );

      await findByText("Just testing");
      await findByText(/Bruno/);

      await findByText("Testing some more");
      await findByText(/Eva/);

      await findByText("2 comments");
    });

    it("renders a new comment when added", async () => {
      const { user, findByText, findByLabelText } = setup(
        <PostComments postSlug="test" />
      );

      const nameInput = await findByLabelText("Name");
      const commentTextarea = await findByLabelText("Comment");
      const submitButton = await findByText("Add comment");

      await user.type(nameInput, "Tester");
      await user.type(commentTextarea, "What's up?");
      await user.click(submitButton);

      await waitFor(async () => {
        await findByText(/Sending/);
      });

      await waitFor(async () => {
        await findByText("3 comments");
        await findByText("What's up?");
      });
    });
  });
});
