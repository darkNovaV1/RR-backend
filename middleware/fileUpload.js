const path = require('path');
const multer = require('multer');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/menuImages'));
  },
  filename: function (req, file, cb) {
    const date = new Date();
    const name = date.toISOString().slice(0, 10) + '-' + file.originalname;
    cb(null, name);
  }
});

// Create multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
