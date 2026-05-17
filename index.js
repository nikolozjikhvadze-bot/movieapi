const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server მუშაობს ✅");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/linki")
  .then(() => {
    console.log("MongoDB დაკავშირებულია ✅");
  })
  .catch((err) => {
    console.error("MongoDB error ❌", err);
  });

// server start
app.listen(PORT, () => {
  console.log(`Server გაშვებულია http://localhost:${PORT}`);
});