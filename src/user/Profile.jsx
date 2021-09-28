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
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs.jsx";
import { listByUser } from "../post/api-post";
import { API } from "../config.js";

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
  // console.log("Profile match ", match);
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    following: false,
  });
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  // let following = checkFollow(data);

  const userId = match.params.userId;
  const {
    token,
    // user: { _id },
  } = isAuthenticated();

  useEffect(() => {
    const abordController = new AbortController();
    const signal = abordController.signal;
    read(userId, token, signal).then((data) => {
      if (data && data.error) {
        setRedirectToLogin(true);
      } else {
        let following = checkFollow(data);
        setValues({ ...values, user: data, following: following });
        setUser(data);
      }
    });

    return function cleanup() {
      abordController.abort();
    };
  }, [userId]);

  const loadPosts = (user) => {
    listByUser(userId, token).then((data) => {
      if (data.error) {
        console.log("data.error loadPosts", data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const clickFollowButton = (callApi) => {
    callApi(userId, token, userId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          user: data,
          following: !values.following,
        });
      }
    });
  };

  // const following = checkFollow(user);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id === userId;
    });
    return match;
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  const photoUrl = userId
    ? `${API}/api/user/photo/${userId}`
    : `${API}/images/photo_profile.png`;
  // https://mern-tuto-back.herokuapp.com/images/photo_profile.png
  return (
    <Paper elevation={4} className={classes.root}>
      <Typography variant="h6" align="center" className={classes.title}>
        Profile
      </Typography>
      {JSON.stringify(posts)}
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl}>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
            <ListItemSecondaryAction>
              <Link to={`/profile/edit/${user._id}`}>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          ) : (
            <FollowProfileButton
              following={values.following}
              onButtonClick={clickFollowButton}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={user.about} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Rejoint: ${new Date(
              user.createdAt
            ).toLocaleDateString()} `}
          />
        </ListItem>
        <Divider />
      </List>
      <ProfileTabs user={values.user} />
    </Paper>
  );
};

export default Profile;
