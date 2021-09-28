import { API } from "../config";

const create = async (userId, token, post) => {
  try {
    let response = await fetch(`${API}/posts/new/${userId}`, {
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
    let response = await fetch(`${API}/posts/feed/${userId}`, {
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
  try {
    let response = await fetch(`${API}/posts/by/${userId}`, {
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

export { listNewsFeed, listByUser, create };
