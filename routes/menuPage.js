const express = require("express");
const router = express.Router();
const path = require("path");



// Route: /
// GET request to get menuPage
router.route("/").get( (req, res) => {
    res.sendFile(path.join(__dirname,'../public/Menu.html'))
});

module.exports = router;