import fc from "fast-check";
import { nameValidation } from "./validations";

describe("validations - lastName", () => {
  it("should return no error when passing more than 3 chars", async () => {
    const input = "Esteva";
    const expected = null;
    const output = nameValidation("Last Name", input);
    expect(output).toBe(expected);
  });
  it("should return no error when passing more than 3 chars and special chars", async () => {
    const input = "D'Angelo";
    const expected = null;
    const output = nameValidation("Last Name", input);
    expect(output).toBe(expected);
  });
  it("should return an error when passing an empty string", async () => {
    const input = "";
    const expected = "Last Name is required";
    const output = nameValidation("Last Name", input);
    expect(output).toBe(expected);
  });
  it("should return an error when passing less than 3 chars", async () => {
    const input = "Aa";
    const expected = "Last Name needs to be at least three characters";
    const output = nameValidation("Last Name", input);
    expect(output).toBe(expected);
  });
  it("should return an error when passing numbers", async () => {
    const input = "Aa999";
    const expected = "Invalid last name";
    const output = nameValidation("Last Name", input);
    expect(output).toBe(expected);
  });
});

xdescribe("form - smart test", () => {
  it.each([
    ["Esteva", null],
    ["D'angelo", null],
    ["", "Last Name is required"],
    ["AA", "Last Name needs to be at least three characters"],
    ["AA999", "Invalid last name"],
  ])(
    "should validate last name, when last name is %s, error is %s",
    (lastName, error) => {
      const output = nameValidation("Last Name", lastName);
      expect(output).toBe(error);
    }
  );
});

xdescribe("fast check validation", () => {
  it("should submit last name and return no error", async () => {
    fc.assert(
      fc.property(fc.string({ minLength: 3 }), function (lastName) {
        const output = nameValidation("Last Name", lastName);
        expect(output).toBe(null);
      }),
      {
        // seed: -655968074,
        // path: "0:0:0",
        // verbose: true,
      }
    );
  });
});
