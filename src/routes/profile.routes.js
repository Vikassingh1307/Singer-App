const express = require("express");
const multer = require("multer");
const profileController = require("../controllers/profile.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/photo", profileController.getProfilePhoto);
router.post(
  "/photo",
  upload.single("photo"),
  profileController.uploadProfilePhoto,
);

module.exports = router;
