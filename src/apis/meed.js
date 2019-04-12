import axios from "axios";
import history from "../history";
import { get as getFromLocalStorage, clearStorage, getUserId } from "../common/GlobalVars"

//const BASE_URL = "http://meed-tfqa.meed.net/meed/api/v1.0";
const BASE_URL = "http://172.16.228.162:6060/meed/api/v1.0";

export const meedAPI = () =>
	axios.create({
		baseURL: BASE_URL,
		headers: {
			"Content-Type": "application/json",
			deviceId: getDeviceID()
		},
		withCredentials: true
	});

export const authGaurd = (stateCode, body) => {
	if (stateCode === 401 || stateCode === 403) {
		clearStorage();
		history.push("/login");
		return body;
	}
	return stateCode;
};
export const internalError = () => {
	clearStorage();
	history.push("/login");
	return;
}

export const post = async (params, url) => {
	try {
		const response = await meedAPI().post(url, params);
		authGaurd(response.status);
		return response.data;
	} catch (err) {
		if (!err.response)
			return internalError();
		return authGaurd(err.response.status,err.response.data);
	}
};

export const get = async (params, url) => {
	try {
		const response = await meedAPI().get(url, params);
		authGaurd(response.status);
		return response.data;
	} catch (err) {
		if (!err.response)
			return internalError();
		return authGaurd(err.response.status,err.response.data);
	}
};

export const getDeviceID = () => getFromLocalStorage("deviceId");

export const login = async params => await post(params, "/corporate/login");

export const signUp = async params => await post(params, "/corporate/signUp");

export const logout = async () => await post({}, "/corporate/logout");

export const dashBoard = async () => await get({}, "/dashboard?userId=" + getUserId());

export const forgotPassword = async params => await post(params, "/corporate/forgotPassword");

export const echo = async params => await post(params, "/corporate/echo");
