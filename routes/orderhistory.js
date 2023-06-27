const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Authentication middleware
const requireAuth = require("../middleware/auth");

// Route: /
// GET request to retrieve orders
router.get("/", requireAuth, async (req, res) => {
  // Retrieve the list of orders from the database
    
    const orderList = await Order.find({user:req.session.user.username});

  // Render the orders view and pass the order list as data
  res.render("orderHistory", { orders: orderList });
});

module.exports = router;
