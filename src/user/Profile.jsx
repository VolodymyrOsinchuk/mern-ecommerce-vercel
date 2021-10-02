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
  // const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToLogin: false,
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
        loadPosts(data._id);
      }
    });

    return function cleanup() {
      abordController.abort();
    };
  }, [userId]);

  const loadPosts = (user) => {
    listByUser({ userId: user }, token).then((data) => {
      // console.log("data loadPosts >>>> ", data);
      if (data.error) {
        console.log("data.error loadPosts", data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const removePost = (post) => {
    const updatePosts = posts;
    const index = updatePosts.indexOf(post);
    updatePosts.slice(index, 1);
    setPosts(updatePosts);
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
  // console.log("values.user", values.user);
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
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl}>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={values.user.name}
            secondary={values.user.email}
          />
          {isAuthenticated().user &&
          isAuthenticated().user._id === values.user._id ? (
            <ListItemSecondaryAction>
              <Link to={`/profile/edit/${values.user._id}`}>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user._id} />
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
          <ListItemText primary={values.user.about} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Rejoint: ${new Date(
              values.user.created
            ).toLocaleDateString()} `}
          />
        </ListItem>
        <Divider />
      </List>
      <ProfileTabs
        user={values.user}
        posts={posts}
        removePostUpdate={removePost}
      />
    </Paper>
  );
};

export default Profile;
