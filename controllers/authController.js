const User = require("../models/UserModel"); // modele Utilisateur
const bcrypt = require("bcrypt"); // hashage password
const jwt = require("jsonwebtoken"); // token generator package

// connexion de l'utilisateur
const signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email ou mot de passe invalide" });
  }
  try {
    // Inscription Utilisateur
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email:email,
      password: hashPassword,
    });
    console.log(newUser);
    await newUser.save();
    res
      .status(200)
      .json({message: "Utilisateur créé avec succès",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
//connexion utilisateur
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email ou mot de passe invalide" });
  }
  try {
    const userIndataBase = await User.findOne({ email });
    console.log(userIndataBase);
    if (!userIndataBase) {
      return res
        .status(400)
        .json({ message: "email ou mot de passe invalide" });
    }
    const arePasswordMatching = await bcrypt.compare(
      password,
      userIndataBase.password
    );
    if (!arePasswordMatching) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide" });
    }
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Utilisateur Connecté" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { signup, login };
