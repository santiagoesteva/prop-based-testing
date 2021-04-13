import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import fc from "fast-check";
import { Form } from "./form";

beforeEach(cleanup);

describe("form", () => {
  it("should submit last name when passing more than 3 chars", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<Form />);
    const input = getByLabelText(/lastName/i);
    fireEvent.change(input, {
      target: { value: "Esteva" },
    });
    fireEvent.blur(input);
    fireEvent.click(getByText("Submit"));
    expect(queryByTestId("error")).not.toHaveTextContent();
    expect(queryByTestId("submitted")).toBeInTheDocument();
  });

  it("should submit last name when passing more than 3 chars and special chars", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<Form />);
    const input = getByLabelText(/lastName/i);
    fireEvent.change(input, {
      target: { value: "D'angelo" },
    });
    fireEvent.blur(input);
    fireEvent.click(getByText("Submit"));
    expect(queryByTestId("error")).not.toHaveTextContent();
    expect(queryByTestId("submitted")).toBeInTheDocument();
  });

  it("should display an error when last name is empty", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<Form />);
    const input = getByLabelText(/lastName/i);
    fireEvent.change(input, {
      target: { value: "" },
    });
    fireEvent.blur(input);
    fireEvent.click(getByText("Submit"));
    expect(queryByTestId("error")).toHaveTextContent("Last Name is required");
    expect(queryByTestId("submitted")).toHaveTextContent("pending");
  });

  it("should display an error when last name is less than 3 chars", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<Form />);
    const input = getByLabelText(/lastName/i);
    fireEvent.change(input, {
      target: { value: "AA" },
    });
    fireEvent.blur(input);
    fireEvent.click(getByText("Submit"));
    expect(queryByTestId("error")).toHaveTextContent(
      "Last Name needs to be at least three characters"
    );
    expect(queryByTestId("submitted")).toHaveTextContent("pending");
  });

  it("should display an error when last name contains numbers", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<Form />);
    const input = getByLabelText(/lastName/i);
    fireEvent.change(input, {
      target: { value: "AA999" },
    });
    fireEvent.blur(input);
    fireEvent.click(getByText("Submit"));
    expect(queryByTestId("error")).toHaveTextContent("Invalid last name");
    expect(queryByTestId("submitted")).toHaveTextContent("pending");
  });
});

describe("form - smart test", () => {
  it.each([
    ["Esteva", "", "submitted"],
    ["D'angelo", "", "submitted"],
    ["", "Last Name is required", "pending"],
    ["AA", "Last Name needs to be at least three characters", "pending"],
    ["AA999", "Invalid last name", "pending"],
  ])(
    "should submit last name, when last name is %s, error is %s and submit state is %s",
    (lastName, error, submitStatus) => {
      const { getByLabelText, getByText, queryByTestId } = render(<Form />);
      const input = getByLabelText(/lastName/i);
      fireEvent.change(input, {
        target: { value: lastName },
      });
      fireEvent.blur(input);
      fireEvent.click(getByText("Submit"));
      expect(queryByTestId("error")).toHaveTextContent(error);
      expect(queryByTestId("submitted")).toHaveTextContent(submitStatus);
    }
  );
});

describe("fast check form", () => {
  it("should submit last name", async () => {
    fc.assert(
      fc
        .property(fc.string({ minLength: 3 }), function (lastName) {
          const { getByLabelText, getByText, queryByTestId } = render(<Form />);
          const input = getByLabelText(/lastName/i);
          fireEvent.change(input, {
            target: { value: lastName },
          });
          fireEvent.blur(input);
          fireEvent.click(getByText("Submit"));
          expect(queryByTestId("error")).not.toHaveTextContent();
          expect(queryByTestId("submitted")).toHaveTextContent("submitted");
        })
        .beforeEach(async () => {
          await cleanup();
        })
      // { verbose: true }
    );
  });
});
