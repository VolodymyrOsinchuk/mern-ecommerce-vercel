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
import { Comment, Delete, Favorite } from "@material-ui/icons";
import { remove, like, unlike } from "./api-post";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { API } from "../config";
import Comments from "./Comments";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginBottom: theme.spacing(3),
    backgroundColor: "rgba(0, 0, 0 ,0.06)",
  },
  cardHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  cardContent: {
    backgroundColor: "white",
    padding: `${theme.spacing(2)}px 0px`,
  },
  text: {
    margin: theme.spacing(2),
  },
  photo: {
    textAlign: "center",
    backgroundColor: "#f2f5f4",
    padding: theme.spacing(1),
  },
  media: {
    height: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Post = (props) => {
  const classes = useStyles();

  const { token, user } = isAuthenticated();
  const postId = props.post._id;
  const userId = user._id;

  const checkLike = (likes) => {
    let match = likes.indexOf(user._id);
    return match;
  };

  const [values, setValues] = useState({
    like: checkLike(props.post.likes),
    likes: props.post.likes.length,
    comments: props.post.comments,
  });

  // console.log("isAuthenticated", isAuthenticated());
  // console.log("props Post", props);

  const deletePost = () => {
    remove(postId, token).then((data) => {
      console.log("data deletepost", data);
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
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar src={`${API}/api/user/photo/${props.post.postedBy._id}`} />
        }
        action={
          props.post.postedBy._id === isAuthenticated().user._id && (
            <IconButton onClick={deletePost}>
              <Delete />
            </IconButton>
          )
        }
        title={
          <Link to={`/profile/${props.post.postedBy._id}`}>
            {props.post.postedBy.name}
          </Link>
        }
        subheader={new Date(props.post.createdAt).toLocaleDateString()}
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
              alt="img de post"
            />
          </div>
        )}
      </CardContent>
      <CardActions>
        {values.like ? (
          <IconButton
            onClick={clickLike}
            className={classes.button}
            aria-label="Like"
            color="secondary"
          >
            <Favorite />
          </IconButton>
        ) : (
          <IconButton
            onClick={clickLike}
            aria-label="Unlike"
            className={classes.button}
            color="secondary"
          >
            <FavoriteBorder />
          </IconButton>
        )}
        <span>{values.likes}</span>
        <IconButton
          aria-label="Comment"
          className={classes.button}
          color="secondary"
        >
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
