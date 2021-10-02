import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { findPeople, follow } from "./api-user";
import ViewIcon from "@material-ui/icons/Visibility";
import { isAuthenticated } from "../auth/auth-helper";
import { API } from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: 0,
  },
  title: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: "1em",
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  follow: {
    right: theme.spacing(2),
  },
  viewButton: {
    verticalAlign: "middle",
  },
}));

const FindPeople = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    users: [],
    open: false,
    followMessage: "",
  });

  const {
    token,
    user: { _id },
  } = isAuthenticated();
  const userId = _id;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    findPeople(userId, token, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, users: data });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const clickFollow = (user, index) => {
    follow(userId, token, user._id).then((data) => {
      if (data.error) {
        console.log("data.error clickFollow", data.error);
      } else {
        let toFollow = values.users;
        toFollow.splice(index, 1);
        setValues({
          ...values,
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`,
        });
      }
    });
  };

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Who to follow
        </Typography>
        <List>
          {values.users.map((item, i) => {
            return (
              <span key={i}>
                <ListItem>
                  <ListItemAvatar className={classes.avatar}>
                    <Avatar src={`${API}/api/user/photo/${item._id}`} />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction className={classes.follow}>
                    <Link to="/">
                      <IconButton
                        variant="contained"
                        color="secondary"
                        className={classes.viewButton}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Link>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        clickFollow(item, item);
                      }}
                    >
                      Follow
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </span>
            );
          })}
        </List>
      </Paper>
    </div>
  );
};

export default FindPeople;
