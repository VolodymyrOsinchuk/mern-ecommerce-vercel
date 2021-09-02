import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Paper,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  List,
  Avatar,
  Divider,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteUser from "./DeleteUser.jsx";
import { isAuthenticated } from "../auth/auth-helper.js";
import { read } from "./api-user.js";
import { Edit, Person } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    color: theme.palette.protectedTitle,
  },
}));

const Profile = ({ match }) => {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const userId = match.params.userId;
  const { token } = isAuthenticated();
  // console.log("token", token);
  // console.log("match", match);
  // console.log("userId", userId);

  useEffect(() => {
    const abordController = new AbortController();
    const signal = abordController.signal;
    read(userId, token, signal).then((data) => {
      if (data && data.error) {
        setRedirectToLogin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abordController.abort();
    };
  }, [userId]);

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <Paper elevation={4} className={classes.root}>
      <Typography variant="h6" align="center" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {isAuthenticated().user && isAuthenticated().user._id === user._id && (
            <ListItemSecondaryAction>
              <Link to={`/profile/edit/${user._id}`}>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={`Rejoint: ${new Date(
              user.createdAt
            ).toLocaleDateString()} `}
          />
        </ListItem>
      </List>
      {/* {JSON.stringify(user)} */}
    </Paper>
  );
};

export default Profile;
