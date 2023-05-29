const express = require("express");
const router = express.Router();
const path = require("path");

// Route: /
// GET request to serve the home page
router.get("/", (req, res) => {
  // Send the home HTML file
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

module.exports = router;
