const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const sauceSchema = mongoose.Schema({
  // schema sauce
    name: { type: String, required: true },  
    manifacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },//le principal ingrédient épicé de la sauce
    imageUrl: { type: String },//l'URL de l'image de la sauce téléchargée par l'utilisateur
    heat : { type: Number},
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    userId: { type: String },//l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    usersLiked: [String],
    usersDisliked: [String] ,

});
sauceSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Sauce", sauceSchema);