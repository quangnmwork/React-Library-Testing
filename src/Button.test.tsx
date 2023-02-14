import { render } from "@testing-library/react";
import Button from "./Button";
import { getByDataCy } from "./test-custom/customQuerires";

test("Test Button Content", async () => {
  render(<Button />);
  expect(getByDataCy(document.body, "button")).toHaveTextContent("Button");
});
