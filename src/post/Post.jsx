import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper";
import { Comment, Delete, Favorite, FavoriteBorder } from "@material-ui/icons";
import { remove, like, unlike } from "./api-post";
import { API } from "../config";
import Comments from "./Comments";

const useStyles = makeStyles((theme) => ({
  root: {},
  cardHeader: {},
  cardContent: {},
  text: {},
  photo: {},
  media: {},
  button: {},
}));

const Post = (props) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    like: checkLike(props.post.likes),
    likes: props.post.likes.length,
    comments: props.post.comments,
  });

  console.log("isAuthenticated", isAuthenticated());
  console.log("props Post", props);

  const { token, user } = isAuthenticated();
  const postId = props.post._id;
  const userId = user._id;

  const deletePost = () => {
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log("data error deletepost", data.error);
      } else {
        props.onRemove(props.post);
      }
    });
  };

  const updateComments = (comments) => {
    setValues({ ...values, comments: comments });
  };

  const checkLike = (like) => {
    let match = likes.indexOf(user._id);
    return match;
  };

  const clickLike = () => {
    let callApi = values.like ? unlike : like;
    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log("data error clickLike", data.error);
      } else {
        setValues({ ...values, like: !values.like, likes: data.likes.length });
      }
    });
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar src={`${API}/api/users/photo/${props.post.postedBy._id}`} />
        }
        action={
          props.post.postedBy._id === isAuthenticated().user._id && (
            <IconButton onClick={deletePost}>
              <Delete />
            </IconButton>
          )
        }
        title={
          <Link to={`/user/${props.post.postedBy._id}`}>
            {props.post.postedBy.name}
          </Link>
        }
        subheader={new Date(props.post.created).toDateString()}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <Typography component="p" className={classes.text}>
          {props.post.text}
        </Typography>
        {props.post.photo && (
          <div className={classes.photo}>
            <img
              className={classes.media}
              src={`${API}/api/posts/photo/${props.post._id}`}
            />
          </div>
        )}
      </CardContent>
      <CardActions>
        {values.like ? (
          <IconButton onClick={clickLike} className={classes.button}>
            <Favorite />
          </IconButton>
        ) : (
          <IconButton onClick={clickLike} className={classes.button}>
            <FavoriteBorder />
          </IconButton>
        )}
        <span>{values.likes}</span>
        <IconButton>
          <Comment />
        </IconButton>
        <span>{values.comments.length}</span>
      </CardActions>
      <Comments
        postId={props.post._id}
        comments={values.comments}
        updateComments={updateComments}
      />
    </Card>
  );
};

export default Post;
