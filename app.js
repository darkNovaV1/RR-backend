const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/RestaurantDB";

// --------------> Set up Middleware <---------------------

// Serve static files (e.g., js and css) from the "public" folder
app.use(express.static("public"));

// Parse URL-encoded form data and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the template engine to EJS
app.set("view engine", "ejs");

// Set up session
const store = new MongoDBSession({
  uri: uri,
  collection: "Session",
});

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false, // create new session for every request even if it's the same user
    saveUninitialized: false, // don't save the session if it hasn't been modified
    store: store, // store the session in MongoDB
  })
);

// --------------> Set up Routes <---------------------

// Define the routes and their respective paths
const routes = [
  { path: "/", router: require("./routes/index") },
  { path: "/login", router: require("./routes/login") },
  { path: "/signUp", router: require("./routes/signup") },
  { path: "/booking", router: require("./routes/booking") },
  { path: "/logout", router: require("./routes/logout") },
  { path: "/bill", router: require("./routes/bill") },
  { path: "/payment", router: require("./routes/payment") },
  { path: "/order", router: require("./routes/order") },
  { path: "/menu", router: require("./routes/menu") },
];

// Register the routes with their respective paths
routes.forEach((route) => {
  app.use(route.path, route.router);
});

// --------------> Start the Server <---------------------

async function startServer() {
  try {
    // Establish connection with MongoDB
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Start listening for incoming connections on port 3000
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();
