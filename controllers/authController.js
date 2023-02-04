const User = require("../models/UserModel");
const signup = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
    return res.status(400).json({ message: "email ou mot de passe invalide" });
    }
    try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur crée avec succès" });
    } catch (error) {
    res.status(500).json({ error });
    }
    
};

module.exports = { signup };
