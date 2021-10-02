import React, { useEffect, useState } from "react";
import { create } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PhotoCamera } from "@material-ui/icons";
import { API } from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#efefef",
    padding: `${theme.spacing(3)}px, 0px, 1px`,
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing(3),
    backgroundColor: "rgba(65, 150, 136, 0.09)",
    boxShadow: "none",
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardContent: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: "90%",
  },
  input: {
    display: "none",
  },
  photoButton: {
    height: 30,
    marginBottom: 5,
  },
  filename: {
    verticalAlign: "super",
  },
  error: {},
  submit: {
    margin: theme.spacing(2),
  },
}));

const NewPost = (props) => {
  // console.log("props NewPost >>> ", props);
  const classes = useStyles();
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

  useEffect(() => {
    setValues({ ...values, user: isAuthenticated().user });
  }, []);

  const clickPost = () => {
    let postData = new FormData();
    postData.append("text", values.text);
    postData.append("photo", values.photo);
    create(userId, token, postData).then((data) => {
      console.log("data clickPost", data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, text: "", photo: "" });
        props.addUpdate(data);
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const photoURL = values.user._id
    ? `${API}/api/user/photo/${values.user._id}`
    : `${API}/images/photo_profile.png`;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder="partage tes pensées"
            multiline
            rows={3}
            margin="normal"
            className={classes.textField}
            value={values.text}
            onChange={handleChange("text")}
          />
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={handleChange("photo")}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ""}{" "}
          </span>
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickPost}
            className={classes.submit}
            disabled={values.text === ""}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NewPost;
