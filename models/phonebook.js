// require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log("Connection error", error.message));

const phonebook = new mongoose.Schema({
  name: String,
  number: String,
});

module.exports = mongoose.model("Phonebook", phonebook);
