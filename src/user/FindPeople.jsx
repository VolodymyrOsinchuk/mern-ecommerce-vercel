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
import { findPeople } from "./api-user";
import ViewIcon from "@mui/icons-material/Visibility";

const FindPeople = () => {
  const [values, setValues] = useState({
    users: [],
  });

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

  return (
    <div>
      <Paper>
        <Typography>Who to follow</Typography>
        <List>
          {values.users.map((item, i) => {
            return (
              <span>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText>
                    <ListItemSecondaryAction>
                      <Link>
                        <IconButton>
                          <ViewIcon />
                        </IconButton>
                      </Link>
                      <Button>Follow</Button>
                    </ListItemSecondaryAction>
                  </ListItemText>
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
