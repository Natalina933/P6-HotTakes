const Sauce = require("../models/SauceModel");
const fs = require("fs"); //Modif
//Création de la Sauce
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  // delete sauceObjet.id;//id et userid supprimés pour sécuriser la connexion utilisateur
  // delete sauce.userId;
  const sauce = new Sauce({
    ...sauceObjet,
    userId: req.auth.userId,
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

exports.getOneSauce = (req, res, next) => {
  // Récupération d'une seule sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/public/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Utilisateur non identifié" });
        return false;
      } else {
        console.log("utilisateur vérifié");
        const filename = sauce.imageUrl.split("/public/images/")[1];
        fs.unlink(`/public/images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => {
              console.log(error);
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
        return false;
      } else {
        const filename = sauce.imageUrl.split("/public/images/")[1];
        fs.unlink(`/public/images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => {
              console.log(error);
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

//Boutons Like et dislike

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  if (like === 1) {
    //si like $inc=opérateur incrémente
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLike: req.body.userId },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous avez aimé cette sauce !" })
      )
      .catch((error) => {
        console.log(error);
        res.status(401).json({ error });
      });
  } else if (req.body.like === -1) {
    //si dislike
    try {
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
      )
        .then(() =>
          res
            .status(200)
            .json({ message: "Vous n'avez pas aimé cette sauce !" })
        )
        .catch((error) => {
          console.log(error);
          res.status(401).json({ error });
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    //si changement d'avis
    Sauce.findOne({ _id: req.params.id }).then((resultat) => {
      if (resultat.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(() =>
            res
              .status(200)
              .json({ message: "Vous avez changé d'avis sur cette sauce !" })
          )

          .catch((error) => {
            console.log(error);
            res.status(401).json({ error });
          });
      } else if (resultat.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $push: { usersDisliked: req.body.userId } }
        )
          .then(() =>
            res
              .status(200)
              .json({ message: "Vous avez changé d'avis sur cette sauce!" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};
