const { Router } = require("express");
const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

router.post("/login", login)
router.post("/signup", signup);

module.exports = router;
