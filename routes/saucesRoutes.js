const { Router } = require("express");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Authentifier les pages du site (middleware)
const multer = require("../middleware/multer-config"); // destination des images (middleware)

const {
  createSauce,
  modifySauce,
  deleteSauce,
  getAllSauces,
  getOneSauce,
  likeSauce,
} = require("../controllers/sauceController");

router.post("/", auth, multer, createSauce);
// router.put("/:id", modifySauce);
// router.delete("/:id", deleteSauce);
// router.post("/:id/like", likeSauce);

router.get("/", getAllSauces);
router.get("/:id", getOneSauce);

module.exports = router;
