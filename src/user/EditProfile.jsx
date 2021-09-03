import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  TextField,
  Icon,
} from "@material-ui/core";
import BackupIcon from "@material-ui/icons/Backup";
import { makeStyles } from "@material-ui/core/styles";
import { isAuthenticated } from "../auth/auth-helper.js";
import { read, update } from "./api-user";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    backgroundColor: "lightgrey",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.protectedTitle,
    margin: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: 10,
  },
}));

const EditProfile = ({ match }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    email: "",
    about: "",
    password: "",
    photo: "",
    error: "",
    open: false,
    redirectToProfile: false,
  });
  const userId = match.params.userId;
  const { token } = isAuthenticated();

  console.log("userId", userId);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(userId, token, signal).then((data) => {
      console.log("data read", data);
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          _id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.about && userData.append("about", values.about);
    values.password && userData.append("password", values.password);
    values.photo && userData.append("photo", values.photo);
    update(userId, token, userData).then((data) => {
      console.log("data update", data);
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  if (values.redirectToProfile) {
    return <Redirect to={`/profile/${userId}`} />;
  }
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" className={classes.title}>
          Edit profile
        </Typography>
        <form noValidate>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            onChange={handleChange("photo")}
            multiple
            type="file"
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="default" component="span">
              Upload <BackupIcon />
            </Button>
          </label>
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ""}
          </span>
          <br />
          <TextField
            label="Nom"
            margin="normal"
            autoComplete="name"
            value={values.name}
            onChange={handleChange("name")}
            className={classes.textField}
          />
          <br />
          <TextField
            label="Email"
            margin="normal"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            className={classes.textField}
          />
          <br />
          <TextField
            label="About"
            margin="normal"
            multiline
            rows="3"
            autoComplete="about"
            value={values.about}
            onChange={handleChange("about")}
            className={classes.textField}
          />
          <br />
          <TextField
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            margin="normal"
            value={values.password}
            onChange={handleChange("password")}
            className={classes.textField}
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </form>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default EditProfile;
