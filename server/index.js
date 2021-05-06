const express = require("express");

const app = express();

app.get("/api", (req, res) => {
  res.send('Hello Back')
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server lancé sur port ${port}`);
});