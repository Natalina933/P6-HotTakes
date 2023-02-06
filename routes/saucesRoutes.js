const { Router } = require("express");
const express = require("express");
const router = express.Router();
const {
  createSauce,
  modifySauce,
  deleteSauce,
  getAllSauces,
  getOneSauce,
  likeSauce,
} = require("../controllers/sauceController");
const auth = require("../middleware/auth"); // Authentifier les pages du site (middleware)
const multer = require("../middleware/multer-config"); // destination des images (middleware)

router.post("/multer", createSauce);
router.put("/multer:id", modifySauce);
router.delete("/auth:id", deleteSauce);
router.post("/auth:id/like", likeSauce);

router.get("/auth", getAllSauces);
router.get("/auth:id", getOneSauce);

module.exports = router;
