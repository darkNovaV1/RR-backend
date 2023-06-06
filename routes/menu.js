const express = require("express");
const router = express.Router();
const path = require("path");
const Menu = require("../models/Menu");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");

// Authentication middleware
const requireAuth = require("../middleware/auth");

// Save uploaded file middleware
const upload = require("../middleware/fileUpload");
const { error } = require("console");

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

  .post(
    (requireAuth,
    async (req, res) => {
      const file = req.files.image;
      const upload = await cloudinary.uploader.upload(file.tempFilePath);

      

      const url = cloudinary.url(upload.public_id, {
        width: 360,
        Crop: "fill",
      });
      const thumbnail = cloudinary.url(upload.public_id, {
        width: 100,
        Crop: "fill",
      });

      const menu = new Menu({
        name: req.body.name,
        cost: parseInt(req.body.cost),
        rating: req.body.rating,
        image: url,
        thumbnail: thumbnail,
        imageID: upload.public_id,
      });

      try {
        await menu.save();
        res.redirect("/menu/menuUpdate");
      } catch (error) {
        console.error(error);
      }
      try {
        // remove the temparay file
        fs.unlink(file.tempFilePath, (err) => {
          if (error) {
            console.log(error);
      
          }
        })
      } catch (e) {
        console.error(e);
      }
    })

  );

// Route: /menuDelete/:item
// POST request to delete a menu item
router.post("/menuDelete/:item", async (req, res) => {
  try {
    const item = await Menu.findOne({ _id: req.params.item });
    // Delete the image file
    await cloudinary.uploader.destroy(item.imageID);

    // Delete the item from the database
    await Menu.findOneAndDelete({ _id: req.params.item });
    res.redirect("/menu/menuUpdate");
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
