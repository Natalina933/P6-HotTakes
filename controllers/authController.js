const User = require("../models/userModel");
const signup = (req, res, next) => {
    const user = new User({
    // créer un nouveau user
    email: req.body.email, // l'adresse mail
    password:req.body.password, // le mot de passe haché
    });
    user
    .save() // et mongoose le stocke dans la bdd
    .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

const login = (req, res, next) => {
    const user = new User({
        // créer un nouveau user
        email: req.body.email, // l'adresse mail
        password: req.body.password, // le mot de passe haché
        });
        user
        .save() // et mongoose le stocke dans la bdd
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
};
module.exports={signup,login}