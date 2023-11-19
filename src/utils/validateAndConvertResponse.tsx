import isValidObject from '@/utils/isValidObject';
import toCamelCaseKeys from '@/utils/toCamelCaseKeys';

const validateAndConvertResponse = (data: any): any => {
  if (!isValidObject(data)) {
    throw new Error();
  }

  return toCamelCaseKeys(data);
};

export default validateAndConvertResponse;
