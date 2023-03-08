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

  delete sauceObject_userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: "Utilisateur non identifié" });
        return false;
      } else {
        console.log("utilisateur vérifié");
        const filename = sauce.imageUrl.split("/public/images/")[1];
        fs.unlink(`./public/images/${filename}`, () => {
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
        fs.unlink(`./public/images/${filename}`, () => {
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
exports.likeSauce = async (req, res, next) => {
  console.log(req);
  const userId = req.auth.userId;
  const like = req.body.like;
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (like === 1) {
      // Si j'ai déjà liké, j'envoie un message d'erreur
      const hasAlreadyLiked = sauce.usersLiked.find((u) => userId === u);
      if (hasAlreadyLiked)
        return res
          .status(200)
          .json({ message: "Vous avez déjà liké cette sauce!" });
      // Si j'ai déjà dislike,
      const hasAlreadyDisliked = sauce.usersDisliked.find((u) => userId === u);
      if (hasAlreadyDisliked) {
        //j'annule mon dislike
        sauce.dislikes = sauce.dislikes - 1;
        const index = sauce.usersDisliked.findIndex((u) => userId === u);
        sauce.usersDisliked.splice(index, 1);
      }
      //Je like
      sauce.likes = sauce.likes + 1;
      sauce.usersLiked.push(userId);
      await sauce.save();
      return res.status(200).json({ message: "Vous avez aimé cette sauce!" });
    } else if (like === -1) {
      // Si j'ai déjà dislike, j'envoie un message d'erreur
      const hasAlreadyDisliked = sauce.usersDisliked.find((u) => userId === u);
      if (hasAlreadyDisliked)
        return res
          .status(200)
          .json({ message: "Vous avez déjà disliké cette sauce!" });
      // Si j'ai déjà liké,
      const hasAlreadyLiked = sauce.usersLiked.find((u) => userId === u);
      if (hasAlreadyLiked) {
        //j'annule mon like
        sauce.likes = sauce.likes - 1;
        const index = sauce.usersLiked.findIndex((u) => userId === u);
        sauce.usersLiked.splice(index, 1);
      }
      //j'ajoute mon dislike
      sauce.dislikes = sauce.dislikes + 1;
      sauce.usersDisliked.push(userId);

      await sauce.save();
      return res
        .status(200)
        .json({ message: "Vous avez disliké cette sauce!" });
    } else {
      // Si j'ai liké la sauce,
      const hasAlreadyLiked = sauce.usersLiked.find((u) => userId === u);
      if (hasAlreadyLiked) {
        //je dois annuler le like
        sauce.likes = sauce.likes - 1;
        const index = sauce.usersLiked.findIndex((u) => userId === u);
        sauce.usersLiked.splice(index, 1);
        await sauce.save();
        return res
          .status(200)
          .json({ message: "Vous avez annulé votre like!" });
      }
      // Si j'ai disliké la sauce,
      const hasAlreadyDisliked = sauce.usersDisliked.find((u) => userId === u);
      if (hasAlreadyDisliked) {
        //je dois annuler le dislike
        sauce.dislikes = sauce.dislikes - 1;
        const index = sauce.usersDisliked.findIndex((u) => userId === u);
        sauce.usersDisliked.splice(index, 1);
        await sauce.save();
        return res
          .status(200)
          .json({ message: "Vous avez annulé votre dislike!" });
      }
      // Sinon, rien n'a été annulé
      return res.status(200).json({ message: "Vous n'avez rien annulé!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
