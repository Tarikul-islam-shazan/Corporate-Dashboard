import axios from "axios";
import history from "../history";
import { get as getFromLocalStorage, clearStorage, getUserId } from "../common/GlobalVars"

//const BASE_URL = "http://meed-tfqa.meed.net/meed/api/v1.0";
const BASE_URL = "http://localhost:6060/meed/api/v1.0";

export const meedAPI = () =>
	axios.create({
		baseURL: BASE_URL,
		headers: {
			authToken: getAuthToken()
		}
	});

export const authGaurd = stateCode => {
	if (stateCode === 401 || stateCode === 403) {
		clearStorage();
		history.push("/login");
		return;
	}
	return stateCode;
};

export const post = async (params, url) => {
	try {
		const response = await meedAPI().post(url, params);
		if (response) {
			authGaurd(response.status);
			return response.data;
		} else {
			console.log('error occured');
		}
	} catch (err) {
		return authGaurd(err.response.status);
	}
};

export const get = async (params, url) => {
	try {
		const response = await meedAPI().get(url, params);
		authGaurd(response.status);
		return response.data;
	} catch (err) {
		return authGaurd(err.response.status);
	}
};

export const getAuthToken = () => getFromLocalStorage("authToken");

export const login = async params => await post(params, "/corporate/login");

export const signUp = async params => await post(params, "/corporate/signUp");

export const logout = async () => await post({}, "/corporate/logout");

export const dashBoard = async () => await get({}, "/dashboard/" + getUserId());

export const forgotPassword = async params => await post(params, "/corporate/forgotPassword");

export const echo = async params => await post(params, "/corporate/echo");
