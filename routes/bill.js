const express = require('express');
const router = express.Router();

// Route: /
// POST request to handle bill submission
router.post('/', async (req, res) => {
  // Store the bill information in the session
  req.session.bill = req.body.selectFoods;
  
  // Send a response indicating successful processing of the bill
  res.json({ message: 'Bill received and processed successfully' });
});

module.exports = router;
