const User = require("../models/UserModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const signup = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
    return res.status(400).json({ message: "email ou mot de passe invalide" });
    }
    try {
    const userIndataBase = await User.findOne({ email });
    if (userIndataBase) {
        return res.status(400).json({ message: "Email ou mot de passe invalide" });
    }
    const arePasswordMatching = await bcrypt.compare(password, userIndataBase.password)
if (arePasswordMatching){
    return res.status(400).json({ message: "Email ou mot de passe invalide" });
}
const token = jwt.sign({
    userId:userIndataBase._id
}, process.env.JWT_SECRET)

res.status(201).json({ userId:userIndataBase._id,token });
    


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

module.exports = { signup,login };
