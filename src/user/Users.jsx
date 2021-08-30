import React, { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { list } from "../user/api-user";
import { Link } from "react-router-dom";
import { ArrowForward, Person } from "@material-ui/icons";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("signal", signal);

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Paper>
      <Typography variant="h6">Toutes utilisateurs</Typography>
      {users.map((user, i) => {
        console.log("user", user);
        return (
          <Link to={`/user/${user._id}`} key={i}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
              <ListItemSecondaryAction>
                <IconButton>
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        );
      })}
    </Paper>
  );
};

export default Users;
