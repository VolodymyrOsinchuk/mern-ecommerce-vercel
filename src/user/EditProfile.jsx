import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper.js";
import { read, update } from "./api-user";
import { Redirect } from "react-router-dom";

const EditProfile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    open: false,
    redirectToProfile: false,
    error: "",
  });
  const userId = match.params.userId;
  const { token } = isAuthenticated();

  console.log("userId", userId);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(userId, token, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = (params) => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    update(userId, token, user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };

  if (values.redirectToProfile) {
    return <Redirect to={`/profile/${userId}`} />;
  }
  return (
    <div>
      <Typography variant="h5">Edit profile</Typography>
      {JSON.stringify(userId)}
    </div>
  );
};

export default EditProfile;
