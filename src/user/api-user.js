import { API } from "../config";

const create = async (user) => {
  try {
    let response = await fetch(`${API}/api/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.err("create user error: " + err.message);
  }
};

const list = async (signal) => {
  try {
    let response = await fetch(`${API}/api/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.err("list user error: " + err.message);
  }
};

const read = async (userId, token, signal) => {
  // console.log("userId", userId);
  // console.log("token", token);
  // console.log("signal", signal);
  try {
    let response = await fetch(`${API}/api/user/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log("read user error: " + err);
  }
};

const update = async (userId, token, user) => {
  try {
    let response = await fetch(`${API}/api/user/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.err("update user error: " + err.message);
  }
};

const remove = async (userId, token) => {
  try {
    let response = await fetch(`${API}/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (err) {
    console.err("delete user error: " + err.message);
  }
};

export { create, list, read, update, remove };
