import React, { useState } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  TextField,
  Typography,
} from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core";
import { API } from "../config";

const useStyles = makeStyles((theme) => ({}));

const Comments = () => {
  const classes = useStyles();
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const {
    user: { _id },
  } = isAuthenticated();
  return (
    <Card>
      <Typography>Coments</Typography>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={`${API}/api/users/photo/${_id}`}
            title={<TextField multiline value={text} onChange={handleChange} />}
          />
        }
      />
    </Card>
  );
};

export default Comments;
