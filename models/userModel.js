const mongoose = require("mongoose");

const userSchema = mongoose.Schema({ // schema bdd Utilisateur
    email: { type: String, required: true  }, // email unique => un utilisateur
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);