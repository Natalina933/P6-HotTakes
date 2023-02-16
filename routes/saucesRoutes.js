const { Router } = require("express");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // Authentifier les pages du site (middleware)
const multer = require("../middlewares/multer-config"); // destination des images (middleware)

const {
  createSauce,
  modifySauce,
  deleteSauce,
  getAllSauces,
  getOneSauce,
  likeSauce,
} = require("../controllers/sauceController");

router.post("/", auth, multer, createSauce);
router.put("/:id", auth, multer, modifySauce);
router.delete("/:id", auth, deleteSauce);
router.post("/:id/like", likeSauce);

router.get("/", multer, getAllSauces);
router.get("/:id", getOneSauce);

module.exports = router;
