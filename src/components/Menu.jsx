// import React from "react";
// import {
//   AppBar,
//   Button,
//   IconButton,
//   Toolbar,
//   Typography,
// } from "@material-ui/core";
// import { Link, withRouter } from "react-router-dom";
// import HomeIcon from "@material-ui/icons/Home";
// import { isAuthenticated, clearJWT } from "../auth/auth-helper";

// const isActive = (history, path) => {
//   if (history.location.pathname === path) {
//     return { color: "#ff4081" };
//   } else {
//     return { color: "#ffffff" };
//   }
// };

// const Menu = withRouter(({ history }) => (
//   <AppBar position="static">
//     <Toolbar>
//       <Typography variant="h6" color="inherit">
//         React Mern
//       </Typography>
//       <Link to="/">
//         <IconButton aria-label="Home" style={isActive(history, "/")}>
//           <HomeIcon />
//         </IconButton>
//       </Link>
//       <Link to="/users">
//         <Button style={isActive(history, "/users")}>Users</Button>
//       </Link>
//       {!isAuthenticated() && (
//         <span>
//           <Link to="/register">
//             <Button style={isActive(history, "/register")}>Register</Button>
//           </Link>
//           <Link to="/login">
//             <Button style={isActive(history, "/login")}>Login</Button>
//           </Link>
//         </span>
//       )}
//       {isAuthenticated() && (
//         <span>
//           <Link to={`/profile/${isAuthenticated().user._id}`}>
//             <Button
//               style={isActive(
//                 history,
//                 `/profile/${isAuthenticated().user._id}`
//               )}
//             >
//               Mon Profile
//             </Button>
//           </Link>
//           <Button
//             color="inherit"
//             onClick={() => {
//               clearJWT(() => history.push("/"));
//             }}
//           >
//             Se deconnecter
//           </Button>
//         </span>
//       )}
//     </Toolbar>
//   </AppBar>
// ));

// export default Menu;
import React, { useState } from 'react'
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material' // Updated imports for MUI v6
import { Link, useLocation, useNavigate } from 'react-router-dom' // Updated to use hooks
import HomeIcon from '@mui/icons-material/Home' // Updated icon import
import { isAuthenticated, clearJWT } from '../auth/auth-helper'

const isActive = (location, path) => {
  return location.pathname === path
    ? { color: '#ff4081' }
    : { color: '#ffffff' }
}

const Menu = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer)
  }

  const handleLogout = () => {
    clearJWT(() => navigate('/')) // Updated to use useNavigate
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
          React Mern
        </Typography>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Home"
          onClick={() => navigate('/')}
        >
          <HomeIcon />
        </IconButton>
        <IconButton color="inherit" onClick={handleDrawerToggle}>
          <span>Menu</span>
        </IconButton>
      </Toolbar>
      {/* Responsive Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerToggle}>
        <List>
          <ListItem
            button
            component={Link}
            to="/"
            style={isActive(location, '/')}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/users"
            style={isActive(location, '/users')}
          >
            <ListItemText primary="Users" />
          </ListItem>
          {!isAuthenticated() ? (
            <>
              <ListItem
                button
                component={Link}
                to="/register"
                style={isActive(location, '/register')}
              >
                <ListItemText primary="Register" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/login"
                style={isActive(location, '/login')}
              >
                <ListItemText primary="Login" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                button
                component={Link}
                to={`/profile/${isAuthenticated().user._id}`}
                style={isActive(
                  location,
                  `/profile/${isAuthenticated().user._id}`
                )}
              >
                <ListItemText primary="Mon Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Se deconnecter" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  )
}

export default Menu
