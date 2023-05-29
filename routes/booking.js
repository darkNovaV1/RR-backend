const express = require("express");
const router = express.Router();
const path = require("path");

// Route: /
// GET request to serve the seat booking page
// POST request to handle seat booking form submission
router.route("/")
  .get((req, res) => {
    // Serve the seat booking HTML file
    res.sendFile(path.join(__dirname, "../public/seat_booking.html"));
  })
  .post((req, res) => {
    // Store the booking information in the session
    req.session.booking = {
      date: req.body.date,
      time: req.body.time,
      partySize: req.body.partySize,
      specialRequest: req.body.specialRequest,
    };
    
    // Redirect to the menu page
    res.redirect("/menu");
  });

module.exports = router;
