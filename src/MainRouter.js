import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import Users from "./user/Users";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/users" component={Users} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/profile/edit/:userId" component={EditProfile} />
        <PrivateRoute path="/profile/:userId" component={Profile} />
      </Switch>
    </div>
  );
};

export default MainRouter;
