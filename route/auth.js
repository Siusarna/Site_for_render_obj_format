const express = require("express");
const path = require("path");
const auth = require("../controllers/auth.js");

module.exports = app => {
  app.get("/login/", auth.getLoginPage);
  app.post("/login/", auth.signIn);
  app.get("/signUp/", auth.getSignUpPage);
  app.post("/signUp/", auth.signUp);
};
