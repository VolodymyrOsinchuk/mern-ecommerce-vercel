import React, { useState } from "react";
import { create } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";

const NewPost = (props) => {
  const [values, setValues] = useState({
    text: "",
    photo: "",
    error: "",
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

  return <div></div>;
};

export default NewPost;
