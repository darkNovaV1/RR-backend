const express = require("express");
const router = express.Router();

// Route: /
// GET request to log out the user
router.get("/", (req, res) => {
  // Destroy the user session
  req.session.destroy();
  
  // Redirect to the home page
  res.redirect("/");
});

module.exports = router;
