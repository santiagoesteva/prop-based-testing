const nameValidation = (fieldName, fieldValue) => {
  if (fieldValue.trim() === "") {
    return `${fieldName} is required`;
  }
  const lastNameRegExp = /^[a-zA-Z'"-.!#$%&’*+\/=?^_`{|}~-]*$/;

  if (!lastNameRegExp.test(fieldValue)) {
    return "Invalid last name";
  }
  if (fieldValue.trim().length < 3) {
    return `${fieldName} needs to be at least three characters`;
  }
  return null;
};

export { nameValidation };
