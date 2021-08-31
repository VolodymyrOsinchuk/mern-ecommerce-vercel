import { API } from "../config";

const login = async (user) => {
  try {
    let response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.err("login error: " + err);
  }
};

const logout = async () => {
  try {
    let response = await fetch(`${API}/auth/logout`, {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    console.err("logout error: " + err.message);
  }
};

export { login, logout };
