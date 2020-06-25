import axios from 'axios';
import history from '../history';
import { get as getFromLocalStorage, clearStorage } from '../common/GlobalVars';

const BASE_URL = process.env.REACT_APP_base_url;

export const meedAPI = () =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      deviceId: getDeviceID(),
    },
    withCredentials: true,
  });

export const authGaurd = (stateCode, body) => {
  if (stateCode === 401 || stateCode === 403) {
    clearStorage();
    history.push('/login');
    return body;
  }
  if (stateCode !== 500) return body;
};
export const internalError = () => {
  clearStorage();
  history.push('/login');
  return;
};

export const post = async (params, url) => {
  try {
    const response = await meedAPI().post(url, params);
    authGaurd(response.status);
    return response.data;
  } catch (err) {
    if (!err.response) return internalError();
    return authGaurd(err.response.status, err.response.data);
  }
};

export const get = async (params, url) => {
  try {
    const response = await meedAPI().get(url, params);
    authGaurd(response.status);
    return response.data;
  } catch (err) {
    if (!err.response) return internalError();
    return authGaurd(err.response.status, err.response.data);
  }
};

export const getDeviceID = () => getFromLocalStorage('deviceId');

export const login = async (params) => await post(params, '/login');

export const signUp = async (params) => await post(params, '/signUp');

export const logout = async (params) => await post(params, '/logout');

export const dashBoardSummary = async () => await get({}, '/dashboard/summary');
export const dashBoardHistoricalData = async (rolling, year) => await get({}, `/dashboard/historicalData?rolling=${rolling}&year=${year}`);

export const forgotPassword = async (params) => await post(params, '/forgotPassword');

export const verification = async (params) => await post(params, '/verification');

export const echo = async (params) => await post(params, '/echo');
