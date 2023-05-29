const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const { securePassword, matchPassword } = require("../utils/passwordUtils");

router
  .route("/")
  .get((req, res) => {
    if (req.session.user) {
      // If the user is already authenticated, redirect to the specified route or the home page
      const redirect = req.session.redirectTo || "/";
      delete req.session.redirectTo;
      res.redirect(redirect);
    } else {
      // Get the error message from the query parameter (if any)
      const errorMessage = req.query.error;
      // Render the login page with the error message
      res.render("login", { error: errorMessage });
    }
  })
  .post(async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        // Check if the provided password matches the stored password
        const matched = matchPassword(req.body.password, user.password);

        if (matched) {
          // Store the user information in the session and redirect to the specified route or the home page
          req.session.user = user;
          const redirectTo = req.session.redirectTo || "/";
          delete req.session.redirectTo;
          res.redirect(redirectTo);
        } else {
          // Incorrect password, redirect to the login page with an error message
          const errorMessage = "Incorrect Password";
          res.redirect("/login?error=" + encodeURIComponent(errorMessage));
        }
      } else {
        // User does not exist, redirect to the login page with an error message
        const errorMessage = "User does not exist";
        res.redirect("/login?error=" + encodeURIComponent(errorMessage));
      }
    } catch (error) {
      res.send(error.message);
    }
  });

module.exports = router;
