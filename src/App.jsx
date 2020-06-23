import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";

import "./all.scss";
import Dashboard from "./containers/Dashboard/dashboard.page";
import Login from "./containers/Auth/Login/Login";
import ForgotPassword from "./containers/Auth/ForgotPassword/ForgotPassword";

import { getIsLogin } from "./common/GlobalVars";
import history from "./history";
import Register from "./containers/Auth/Register/Register";

class App extends Component {
  componentWillMount() {
    if (getIsLogin() === "true") {
      history.push("/");
    } else {
      if (history.location.pathname === "/forgot-password") {
      } else if (history.location.pathname === "/register") {
      } else {
        history.push("/login");
      }
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/" exact component={Dashboard} />
          <Route path="/forgot-password" exact component={ForgotPassword} />
        </Switch>
      </Router>
    );
  }
}

export default App;
