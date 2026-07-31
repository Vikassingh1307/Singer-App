const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");

const inMemoryMusic = [];

function getToken(req) {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (cookieToken) {
    return cookieToken;
  }

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}

function getUploadedFile(req) {
  return req.file || req.files?.music?.[0] || req.files?.file?.[0];
}

function getUploadedImage(req) {
  return req.files?.image?.[0] || req.files?.cover?.[0] || req.files?.file?.[0];
}

async function getAllMusic(req, res) {
  try {
    let musicList = [];

    if (mongoose.connection.readyState === 1) {
      musicList = await musicModel.find().sort({ createdAt: -1 });
    } else {
      musicList = inMemoryMusic.slice().reverse();
    }

    return res.status(200).json({
      success: true,
      message: "Music fetched successfully",
      count: musicList.length,
      music: musicList.map((item) => ({
        id: item._id,
        title: item.title,
        uri: item.uri,
        image: item.image || "",
        artist: item.artist,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch music",
      error: error.message,
    });
  }
}

async function getMusicById(req, res) {
  try {
    const { id } = req.params;
    let musicItem = null;

    if (mongoose.connection.readyState === 1) {
      musicItem = await musicModel.findById(id);
    } else {
      musicItem =
        inMemoryMusic.find((item) => item._id.toString() === id) || null;
    }

    if (!musicItem) {
      return res
        .status(404)
        .json({ success: false, message: "Music not found" });
    }

    return res.status(200).json({
      success: true,
      music: {
        id: musicItem._id,
        title: musicItem.title,
        uri: musicItem.uri,
        image: musicItem.image || "",
        artist: musicItem.artist,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch music",
      error: error.message,
    });
  }
}

async function updateMusic(req, res) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    let musicItem = null;
    if (mongoose.connection.readyState === 1) {
      musicItem = await musicModel.findById(id);
      if (musicItem && musicItem.artist.toString() !== decoded.id) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own music",
        });
      }
      musicItem = await musicModel.findByIdAndUpdate(
        id,
        { title },
        { new: true },
      );
    } else {
      musicItem = inMemoryMusic.find((item) => item._id.toString() === id);
      if (musicItem && musicItem.artist.toString() !== decoded.id) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own music",
        });
      }
      if (musicItem) {
        musicItem.title = title;
      }
    }

    if (!musicItem) {
      return res
        .status(404)
        .json({ success: false, message: "Music not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Music updated successfully",
      music: {
        id: musicItem._id,
        title: musicItem.title,
        uri: musicItem.uri,
        image: musicItem.image || "",
        artist: musicItem.artist,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update music",
      error: error.message,
    });
  }
}

async function deleteMusic(req, res) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const musicItem = await musicModel.findById(id);
      if (!musicItem) {
        return res
          .status(404)
          .json({ success: false, message: "Music not found" });
      }
      if (musicItem.artist.toString() !== decoded.id) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own music",
        });
      }
      await musicModel.findByIdAndDelete(id);
    } else {
      const index = inMemoryMusic.findIndex(
        (item) => item._id.toString() === id,
      );
      if (index === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Music not found" });
      }
      if (inMemoryMusic[index].artist.toString() !== decoded.id) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own music",
        });
      }
      inMemoryMusic.splice(index, 1);
    }

    return res
      .status(200)
      .json({ success: true, message: "Music deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete music",
      error: error.message,
    });
  }
}

async function createMusic(req, res) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access to create music" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const title = req.body.title || req.body.name;
  const file = getUploadedFile(req);
  const imageFile = getUploadedImage(req);

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!file?.buffer) {
    return res.status(400).json({ message: "Music file is required" });
  }

  try {
    let uri = "https://ik.imagekit.io/lhju2un3c/white_mustang.mp3";
    const uploadResult = await uploadFile(
      file.buffer.toString("base64"),
      file.originalname,
    );

    if (uploadResult?.url) {
      uri = uploadResult.url;
    } else {
      const uploadDir = path.join(__dirname, "../../uploads/music");
      fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${file.originalname || "music"}`;
      const targetPath = path.join(uploadDir, fileName);
      fs.writeFileSync(targetPath, file.buffer);
      uri = `/uploads/music/${fileName}`;
    }

    let imageUrl = "";
    if (imageFile?.buffer) {
      const imageUploadResult = await uploadFile(
        imageFile.buffer.toString("base64"),
        imageFile.originalname,
      );
      imageUrl = imageUploadResult?.url || "";

      if (!imageUrl) {
        const imageDir = path.join(__dirname, "../../uploads/images");
        fs.mkdirSync(imageDir, { recursive: true });
        const imageName = `${Date.now()}-${imageFile.originalname || "cover"}`;
        const imagePath = path.join(imageDir, imageName);
        fs.writeFileSync(imagePath, imageFile.buffer);
        imageUrl = `/uploads/images/${imageName}`;
      }
    }

    let music;
    if (mongoose.connection.readyState === 1) {
      music = await musicModel.create({
        uri,
        image: imageUrl,
        title,
        artist: decoded.id,
      });
    } else {
      music = {
        _id: new mongoose.Types.ObjectId(),
        uri,
        image: imageUrl,
        title,
        artist: decoded.id,
      };
      inMemoryMusic.push(music);
    }

    return res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        title: music.title,
        uri: music.uri,
        image: music.image || "",
        artist: music.artist,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to create music" });
  }
}

module.exports = {
  createMusic,
  getAllMusic,
  getMusicById,
  updateMusic,
  deleteMusic,
};
