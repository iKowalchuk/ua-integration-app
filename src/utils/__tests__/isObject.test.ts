import isObject from '../isObject';

describe('isObject', () => {
  it('should return true when the input is an object', () => {
    const testData = { name: 'John', age: 30 };
    expect(isObject(testData)).toBe(true);
  });

  it('should return false when the input is a string', () => {
    const testData = 'This is a string, not an object';
    expect(isObject(testData)).toBe(false);
  });

  it('should return false when the input is null', () => {
    const testData = null;
    expect(isObject(testData)).toBe(false);
  });

  it('should return false when the input is an array', () => {
    const testData = [1, 2, 3, 4];
    expect(isObject(testData)).toBe(false);
  });

  it('should return false when the input is a number', () => {
    const testData = 100;
    expect(isObject(testData)).toBe(false);
  });

  it('should return false when the input is a function', () => {
    const testData = () => undefined;
    expect(isObject(testData)).toBe(false);
  });

  it('should return false when the input is undefined', () => {
    const testData = undefined;
    expect(isObject(testData)).toBe(false);
  });
});
