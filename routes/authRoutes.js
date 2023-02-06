const { Router } = require("express");
const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const { signup } = require("../controllers/authController");

router.post("/signup", signup);

module.exports = router;
