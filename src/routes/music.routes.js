const express = require("express");
const musicController = require("../controllers/music.controller");

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", musicController.getAllMusic);
router.get("/:id", musicController.getMusicById);
router.patch("/:id", musicController.updateMusic);
router.delete("/:id", musicController.deleteMusic);
router.post(
  "/upload",
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  musicController.createMusic,
);

module.exports = router;
