import React, { useEffect, useState } from "react";
import { Card, Divider, Typography } from "@material-ui/core";
import { listNewsFeed } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import PostList from "./PostList";
import NewPost from "./NewPost";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "auto",
    paddingTop: 0,
    paddingBottom: theme.spacing(3),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
  },
}));

const Newsfeed = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  const {
    token,
    user: { _id },
  } = isAuthenticated();
  const userId = _id;
  // console.log("Newsfeed token", token);
  // console.log("Newsfeed userId", userId);
  // console.log("Newsfeed posts", posts);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed(userId, token, signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const addPost = (post) => {
    const updatePosts = [...posts];
    updatePosts.unshift(post);
    setPosts(updatePosts);
  };

  const removePost = (post) => {
    const updatePosts = [...posts];
    const index = updatePosts.indexOf(post);
    console.log("index removePosts", index);
    updatePosts.splice(index, 1);
    setPosts(updatePosts);
  };

  return (
    <div>
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          Newsfeed
        </Typography>
        <Divider />
        <NewPost addUpdate={addPost} />
        <Divider />
        <PostList removeUpdate={removePost} posts={posts} />
      </Card>
    </div>
  );
};

export default Newsfeed;
