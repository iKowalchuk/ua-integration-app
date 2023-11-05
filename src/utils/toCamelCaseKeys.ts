import camelcaseKeys from 'camelcase-keys';

const toCamelCaseKeys = (data: any) => camelcaseKeys(data, { deep: true });

export default toCamelCaseKeys;
