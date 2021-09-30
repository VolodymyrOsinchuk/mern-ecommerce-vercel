import React, { useEffect, useState } from "react";
import { Card, Divider, Typography, Divider } from "@material-ui/core";
import { listNewsFeed } from "./api-post";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import PostList from "./PostList";
import NewPost from "./NewPost";

const useStyles = makeStyles((theme) => ({}));

const Newsfeed = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  const {
    token,
    user: { _id },
  } = isAuthenticated();
  const userId = _id;
  console.log("Newsfeed token", token);
  console.log("Newsfeed userId", userId);

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
    const updatePost = [...posts];
    updatePost.unshift(post);
    setPosts(updatePost);
  };

  const removePost = (post) => {
    const updatePost = [...posts];
    const index = updatePost.indexOf(post);
    console.log("index removePost", index);
    updatePost.splice(index, 1);
    setPosts(updatePost);
  };

  return (
    <div>
      <Card>
        <Typography type="title">Newsfeed</Typography>
        {JSON.stringify(posts)}
        <Divider />
        <NewPost addUpdate={addPost} />
        <Divider />
        <PostList removeUpdate={removePost} posts={posts} />
      </Card>
    </div>
  );
};

export default Newsfeed;
