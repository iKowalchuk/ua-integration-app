import isValidObject from '../isValidObject';

describe('isValidObject', () => {
  it('should return true when the input is an object', () => {
    const testData = { name: 'John', age: 30 };
    expect(isValidObject(testData)).toBe(true);
  });

  it('should return false when the input is a string', () => {
    const testData = 'This is a string, not an object';
    expect(isValidObject(testData)).toBe(false);
  });

  it('should return false when the input is null', () => {
    const testData = null;
    expect(isValidObject(testData)).toBe(false);
  });

  it('should return false when the input is an array', () => {
    const testData = [1, 2, 3, 4];
    expect(isValidObject(testData)).toBe(false);
  });

  it('should return false when the input is a number', () => {
    const testData = 100;
    expect(isValidObject(testData)).toBe(false);
  });

  it('should return false when the input is a function', () => {
    const testData = () => undefined;
    expect(isValidObject(testData)).toBe(false);
  });

  it('should return false when the input is undefined', () => {
    const testData = undefined;
    expect(isValidObject(testData)).toBe(false);
  });
});
