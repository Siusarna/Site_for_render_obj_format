const express = require("express");
const path = require("path");
const auth = require("../controllers/auth.js");

module.exports = app => {
  app.get("/login/", auth.getPage);
  app.post("/login/", auth.signUp);
};
