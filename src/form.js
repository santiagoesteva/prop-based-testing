import React from "react";
import { Debug } from "./debug";
import { nameValidation } from "./validations";

const validate = {
  lastName: (name) => nameValidation("Last Name", name),
};

const initialValues = {
  lastName: "",
};

export function Form() {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (evt) => {
    const { name, value: newValue, type } = evt.target;
    setValues({
      ...values,
      [name]: newValue,
    });
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleBlur = (evt) => {
    const { name, value } = evt.target;
    const { [name]: removedError, ...rest } = errors;
    const error = validate[name](value);
    setErrors({
      ...rest,
      ...(error && { [name]: touched[name] && error }),
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const formValidation = Object.keys(values).reduce(
      (acc, key) => {
        const newError = validate[key](values[key]);
        const newTouched = { [key]: true };
        return {
          errors: {
            ...acc.errors,
            ...(newError && { [key]: newError }),
          },
          touched: {
            ...acc.touched,
            ...newTouched,
          },
        };
      },
      {
        errors: { ...errors },
        touched: { ...touched },
      }
    );
    setErrors(formValidation.errors);
    setTouched(formValidation.touched);

    if (
      !Object.values(formValidation.errors).length &&
      Object.values(formValidation.touched).length ===
        Object.values(values).length && //
      Object.values(formValidation.touched).every((t) => t === true) // every touched field is true
    ) {
      console.log(JSON.stringify(values));
      setSubmitted(true);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="first-name-input">
              Last Name
              <input
                aria-label="lastName"
                className="form-control"
                id="last-name-input"
                placeholder="Enter last name"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                name="lastName"
                required
              />
              <div data-testid="error">
                {touched.lastName && errors.lastName}
              </div>
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
      <Debug values={values} errors={errors} touched={touched} />
      <div data-testid="submitted">{submitted ? "submitted" : "pending"}</div>
    </>
  );
}
