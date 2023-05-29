const express = require("express");
const router = express.Router();
const path = require("path");
const Order = require("../models/Order");

// Authentication middleware
const requireAuth = require("../middleware/auth");

// Route: /
// GET request to display the payment page
router.get("/", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/payment.html"));
});

// Route: /
// POST request to process the payment and create a new order
router.post("/", async (req, res) => {
  // Create a new order object with the provided data
  const order = new Order({
    user: req.session.user.username,
    date: req.session.booking.date,
    time: req.session.booking.time,
    partySize: req.session.booking.partySize,
    specialRequest: req.session.booking.specialRequest,
    bill: req.session.bill,
  });

  try {
    // Save the order to the database
    await order.save();
  } catch (error) {
    console.error(error);
  }

  // Send the order as a response
  res.send(order);
});

module.exports = router;
