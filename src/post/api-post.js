import { API } from "../config";

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

module.exports = {
  listNewsFeed,
  listByUser,
};
