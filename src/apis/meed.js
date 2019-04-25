import axios from "axios";
import history from "../history";
import { get as getFromLocalStorage, clearStorage, getUserId } from "../common/GlobalVars"

const BASE_URL = process.env.REACT_APP_base_url;

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
		return authGaurd(err.response.status, err.response.data);
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
		return authGaurd(err.response.status, err.response.data);
	}
};

export const getDeviceID = () => getFromLocalStorage("deviceId");

export const login = async params => await post(params, "/login");

export const signUp = async params => await post(params, "/signUp");

export const logout = async params => await post(params, "/logout");

export const dashBoard = async () => await get({}, "/dashboard?userId=" + getUserId());

export const forgotPassword = async params => await post(params, "/forgotPassword");

export const echo = async params => await post(params, "/echo");
