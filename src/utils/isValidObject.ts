const isValidObject = (value: any): boolean => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Function)
  );
};
export default isValidObject;
