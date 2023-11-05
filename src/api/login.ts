import { v4 as uuidv4 } from 'uuid';

import api from './api';
import isEmpty from '../utils/isEmpty';
import isObject from '../utils/isObject';
import toCamelCaseKeys from '../utils/toCamelCaseKeys';

type Login = {
  token: string;
  user: {
    access: number;
    accessMenu: number;
    carNumber: string;
    descr: string;
    disabled: number;
    idHouse: number;
    idUsers: number;
    isDelete: number;
    login: string;
    nameHouse: string;
    phone: string;
    pinkod: string;
    room: number;
  };
};

const login = async ({
  baseURL,
  login,
  password,
}: {
  baseURL: string;
  login: string;
  password: string;
}): Promise<Login> => {
  const token = uuidv4();

  const { data } = await api.post(
    '/api/ios.php',
    {
      login,
      password,
      token,
    },
    { baseURL }
  );

  if (!isObject(data)) {
    throw new Error();
  }

  if (isEmpty(data) || isEmpty(data.DETAIL_USER)) {
    throw new Error();
  }

  const res = toCamelCaseKeys(data);

  return { user: res.detailUser, token };
};

export default login;
