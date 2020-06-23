import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";

import "./all.scss";

import Dashboard from "./containers/Dashboard/dashboard.page";
import Login from "./containers/Auth/Login/login.page";
import ForgotPassword from "./containers/Auth/ForgotPassword/forgotPassword.page";

import { getIsLogin } from "./common/GlobalVars";
import history from "./history";
import Registration from "./containers/Auth/Registration/registration.page";
import Verification from "./containers/Auth/Verification/verification.page";

class App extends Component {
  componentWillMount() {
    if (getIsLogin() === "true") {
      history.push("/");
    } else {
      if (history.location.pathname === "/login") {
        history.push("/login");
      }
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} />
          <Route path="/verification" exact component={Verification} />
          <Route path="/" exact component={Dashboard} />
          <Route path="/forgot-password" exact component={ForgotPassword} />
        </Switch>
      </Router>
    );
  }
}

export default App;
