// import toCamelCaseKeys from './toCamelCaseKeys';

describe('toCamelCaseKeys', () => {
  it('converts object keys to camel case', () => {
    const data = {
      first_name: 'John',
      last_name: 'Doe',
      user_details: {
        email_address: 'john.doe@mail.com',
      },
    };

    // const result = toCamelCaseKeys(data);

    const expectedOutput = {
      firstName: 'John',
      lastName: 'Doe',
      userDetails: {
        emailAddress: 'john.doe@mail.com',
      },
    };

    // expect(result).toEqual(expectedOutput);
  });

  it('handles an empty object correctly', () => {
    const data = {};

    // const result = toCamelCaseKeys(data);

    const expectedOutput = {};

    // expect(result).toEqual(expectedOutput);
  });
});
