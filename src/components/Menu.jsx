import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";

const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        React Mern
      </Typography>
      <Link to="/">
        <IconButton>
          <HomeIcon />
        </IconButton>
      </Link>
    </Toolbar>
  </AppBar>
));

export default Menu;
