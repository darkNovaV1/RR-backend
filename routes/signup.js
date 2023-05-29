const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const { securePassword, matchPassword } = require("../utils/passwordUtils");

// Route: /
// GET request to display the signup page
router.get("/", (req, res) => {
  // Get the error message from the query parameter
  const errorMessage = req.query.error;
  res.render("signup", { error: errorMessage });
});

// Route: /
// POST request to process the signup form data and create a new user
router.post("/", async (req, res) => {
  // Secure the user's password
  const spassword = await securePassword(req.body.password);

  // Create a new user object with the provided data
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: spassword,
  });

  try {
    // Check if a user with the same username or email already exists
    const oldUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (!oldUser) {
      // Save the new user to the database
      const savedUser = await user.save();

      // Store the user in the session
      req.session.user = savedUser;

      // Redirect to the intended page or the root path
      const redirect = req.session.redirectTo || "/";
      delete req.session.redirectTo;
      res.redirect(redirect);
    } else {
      const errorMessage = "Username or Email already exists";
      res.redirect("/signUp?error=" + encodeURIComponent(errorMessage));
    }
  } catch (error) {
    console.error(error.message);
    res.send(error);
  }
});

module.exports = router;
