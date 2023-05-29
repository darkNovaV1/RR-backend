const express = require("express");
const router = express.Router();
const path = require("path");
const Menu = require("../models/Menu");
const fs = require('fs');

// Authentication middleware
const requireAuth = require("../middleware/auth");

// Save uploaded file middleware
const upload = require("../middleware/fileUpload");

// Route: /
// GET request to render the Menu page with food items
router.route("/").get(async (req, res) => {
  const foods = await Menu.find();
  res.render("Menu", { foodItems: foods });
});

// Route: /menuUpdate
// GET request to render the menuUpdate page with menu items
// POST request to handle form submission for adding a new menu item
router
  .route("/menuUpdate")
  .get(requireAuth, async (req, res) => {
    const foods = await Menu.find();
    res.render("menuUpdate", { menuItems: foods });
  })
  .post(upload.single("image"), async (req, res) => {
    const menu = new Menu({
      name: req.body.name,
      cost: parseInt(req.body.cost),
      rating: req.body.rating,
      image: req.file.filename,
    });

    try {
      await menu.save();
      res.redirect("/menu/menuUpdate");
    } catch (error) {
      console.error(error);
    }
  });

// Route: /menuDelete/:item
// POST request to delete a menu item
router.post("/menuDelete/:item", async (req, res) => {
  try {
    const item = await Menu.findOne({ _id: req.params.item });
    // Delete the image file
    fs.unlink(path.join(__dirname, "../public/menuImages/") + item.image, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File deleted successfully");
    });
    // Delete the item from the database
    await Menu.findOneAndDelete({ _id: req.params.item });
    res.redirect("/menu/menuUpdate");
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
