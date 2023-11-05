import isEmpty from '../isEmpty';

describe('isEmpty', () => {
  test('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  test('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test('should return true for an empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  test('should return false for a non empty string', () => {
    expect(isEmpty('Hello')).toBe(false);
  });

  test('should return true for an empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  test('should return false for a non empty array', () => {
    expect(isEmpty(['Hello'])).toBe(false);
  });

  test('should return true for an empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('should return false for a non empty object', () => {
    expect(isEmpty({ name: 'John' })).toBe(false);
  });
});
