export const set = (key, value) => {
  if (typeof value == "object") {
    value = JSON.stringify(value);
    // console.log("set Object data: " + key + "data: "+value);
  }
  localStorage.setItem(key, value);

  if (key === "gblAccountSummary") {
    // Following exception handling is imp, when loginStatus is not success.
    try {
      this.globalBankingData.next(value);
    } catch (ex) {
      console.log(
        "Error in saving gblAccountSummary value in globalBankingData " + ex
      );
    }
  }
};

export const get = key => {
  return localStorage.getItem(key) != null ? localStorage.getItem(key) : "";
};

export const remove = key => localStorage.removeItem(key);

export const clearStorage = () => localStorage.clear();

export const setIsLogin = value => set("isLogin", value);

export const getIsLogin = () => get("isLogin");

export const getDashboardData = () => get("statusHistory");

export const setDashboardData = history => set("statusHistory", history);
