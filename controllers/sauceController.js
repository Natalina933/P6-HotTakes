const { json } = require("express");
const Sauce = require("../models/SauceModel");

//Création de la Sauce
exports.createSauce = (req, res, next) => {
  const sauceObjet = json.parse(req.body.sauce);
  // delete sauceObject._id;
  // delete sauce._userId;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get("host")}/public/images/${
      req.file.filename
    }`,
  }); // url de l'image enregistrer dans la bdd et dans le fichier images
  sauce
    .save() // la sauce est sauvegardée dans la bdd
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  // Récupération de toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// exports.getOneSauce = (req, res, next) => {
//   // Récupération d'une seule sauce
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => res.status(200).json(sauce))
//     .catch((error) => res.status(404).json({ error }));
// };


