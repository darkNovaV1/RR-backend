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
  const date = new Date().toJSON().slice(0,18);
  // Create a new order object with the provided data
  const order = new Order({
    user: req.session.user.username,
    date: req.session.booking.date,
    time: req.session.booking.time,
    partySize: req.session.booking.partySize,
    specialRequest: req.session.booking.specialRequest,
    bill: req.session.bill,
    total:req.session.total,
    orderedAt:date,

  });


  try {
    // Save the order to the database
    await order.save();
    

  } catch (error) {
    console.error(error);
  }
  //delete the order session data
  delete req.session.bill;
  delete req.session.total;
  delete req.session.specialRequest;
  
  // Send the order as a response
  res.sendFile(path.join(__dirname, "../public/thankyou.html"));
});

module.exports = router;
