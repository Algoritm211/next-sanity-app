
export const requiredValidator = (value: string) => {
  return value ? undefined : 'Field is Required';
};
