const express = require('express');
const router = express.Router();

// Route: /
// POST request to handle bill submission
router.post('/',  (req, res) => {
  // Store the bill information in the session
   req.session.bill = req.body.selectFoods;
   req.session.total= req.body.totalCostValue;

   console.log(req.body.selectFoods);
   console.log(req.body.totalCostValue);

  
  // Send a response indicating successful processing of the bill
   res.json({ message: 'Bill received and processed successfully' });
});

module.exports = router;
