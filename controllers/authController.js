const User = require("../models/UserModel"); // modele Utilisateur
const bcrypt = require("bcrypt"); // hashage password
const jwt = require("jsonwebtoken"); // token generator package
require("dotenv").config()


// connexion de l'utilisateur
const signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // véfication de l'email (il faut qu'il soit unique dans la bdd)
    return res.status(400).json({ message: "email ou mot de passe invalide" });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      password: hashPassword,
    });
    // console.log(newUser);
    await newUser.save();
    
    res.status(200).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
//connexion utilisateur
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    //vérification du mail
    return res.status(400).json({ message: "email ou mot de passe invalide" });
  }
  const userIndataBase = await User.findOne({ email });
  if (!userIndataBase) {
    return res.status(400).json({ message: "email ou mot de passe invalide" });
  }
  const arePasswordMatching = await bcrypt.compare(
    password,
    userIndataBase.password
  );
  if (!arePasswordMatching) {
    return res.status(400).json({ message: "Email ou mot de passe invalide" });
  }
  const token = jwt.sign(
    {
      userId: userIndataBase._id,
    },
    process.env.JWT_SECRET
  );
  res.status(200).json({ userId: userIndataBase._id, token });
};

module.exports = { signup, login };
