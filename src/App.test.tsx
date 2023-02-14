import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Fetch from "./Fetch";

const server = setupServer(
  rest.get("/greeting", (req, res, ctx) => {
    return res(ctx.json({ greeting: "hello there" }));
  })
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
test("loads and displays greeting", async () => {
  render(<Fetch url={"/greeting"} />);
  fireEvent.click(screen.getByText("Load Greeting"));
  await screen.findByRole("heading");
  expect(screen.getByRole("heading")).toBeDefined();
  expect(screen.getByRole("button")).toBeDisabled();
});

test("handles server error", async () => {
  server.use(
    rest.get("/greeting", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  render(<Fetch url={"/greeting"} />);
  userEvent.click(screen.getByText("Loading Greeting"));

  await screen.findByRole("alert");
  expect(screen.getByRole("alert")).toHaveTextContent("Oops, failed to fetch!");
  expect(screen.getByRole("button")).not.toBeDisabled();
});
