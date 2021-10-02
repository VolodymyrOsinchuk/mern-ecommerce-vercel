import { API } from "../config";

const create = async (userId, token, post) => {
  try {
    let response = await fetch(`${API}/api/posts/new/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: post,
    });
    return await response.json();
  } catch (error) {
    console.error("create post error: " + error.message);
  }
};

const listNewsFeed = async (userId, token, signal) => {
  try {
    let response = await fetch(`${API}/api/posts/feed/${userId}`, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("listNewsFeed error: " + error.message);
  }
};

const listByUser = async (userId, token) => {
  // console.log("userId listByUser", userId.userId);
  // console.log("token listByUser", token);

  try {
    let response = await fetch(`${API}/api/posts/by/${userId.userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("listNewsFeed error: " + error.message);
  }
};

const remove = async (postId, token) => {
  console.log("postId remove", postId);
  console.log("token remove", token);
  try {
    let response = await fetch(`${API}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("remove response", response);
    return await response.json();
  } catch (error) {
    console.error("delete error: " + error.message);
  }
};

const like = async (userId, token, postId) => {
  try {
    let response = await fetch(`${API}/api/posts/like`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userId, postId),
    });
    return await response.json();
  } catch (error) {
    console.error("like error: " + error.message);
  }
};

const unlike = async (userId, token, postId) => {
  try {
    let response = await fetch(`${API}/api/posts/unlike`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: userId, postId: postId }),
    });
    console.log("unlike response", response);

    return await response.json();
  } catch (error) {
    console.error("unlike error: " + error.message);
  }
};

const comment = async (userId, token, postId, comment) => {
  try {
    let response = await fetch(`${API}/api/posts/comment`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
        comment: comment,
      }),
    });
    console.log("comment response", response);
    return await response.json();
  } catch (error) {
    console.error("comment error: " + error.message);
  }
};

const uncomment = async (userId, token, postId, comment) => {
  console.log("uncomment userId", userId);
  console.log("uncomment token", token);
  console.log("uncomment postId", postId);
  console.log("uncomment comment", comment);
  try {
    let response = await fetch(`${API}/api/posts/uncomment`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
        comment: comment,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("comment error: " + error.message);
  }
};

export {
  listNewsFeed,
  listByUser,
  create,
  remove,
  like,
  unlike,
  comment,
  uncomment,
};
