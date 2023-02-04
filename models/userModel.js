const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema({
  // schema bdd Utilisateur
    email: { type: String, required: true, unique: true }, // email unique => un utilisateur
    password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
