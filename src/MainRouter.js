import React from "react";
import { Switch, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Users from "./user/Users";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
      </Switch>
    </div>
  );
};

export default MainRouter;
