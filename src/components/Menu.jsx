import React from "react";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { isAuthenticated, clearJWT } from "../auth/auth-helper";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff4081" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        React Mern
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      <Link to="/users">
        <Button style={isActive(history, "/users")}>Users</Button>
      </Link>
      {!isAuthenticated() && (
        <span>
          <Link to="/register">
            <Button style={isActive(history, "/register")}>Register</Button>
          </Link>
          <Link to="/login">
            <Button style={isActive(history, "/login")}>Login</Button>
          </Link>
        </span>
      )}
      {isAuthenticated() && (
        <span>
          <Link to={`/profile/${isAuthenticated().user._id}`}>
            <Button
              style={isActive(
                history,
                `/profile/${isAuthenticated().user._id}`
              )}
            >
              Mon Profile
            </Button>
          </Link>
          <Button
            color="inherit"
            onClick={() => {
              clearJWT(() => history.push("/"));
            }}
          >
            Login
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
));

export default Menu;
