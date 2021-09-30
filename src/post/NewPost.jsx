import React, { useState } from "react";
import { create } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";

const NewPost = (props) => {
  const [values, setValues] = useState({
    text: "",
    photo: "",
    error: "",
    user: {},
  });

  const {
    token,
    user: { _id },
  } = isAuthenticated();
  const userId = _id;

  const clickPost = () => {
    let postData = new FormData();
    postData.append("text", values.text);
    postData.append("photo", values.photo);
    create(userId, token, postData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, text: "", photo: "" });
        props.addUpdate(data);
      }
    });
  };

  return (
    <div>
      <Card>
        <CardHeader />
        <CardContent>
          <TextField />
          <input />
          <label>
            <IconButton>
              <PhotoCamera />
            </IconButton>
          </label>
          <span></span>
        </CardContent>
        <CardActions>
          <Button>POST</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NewPost;
