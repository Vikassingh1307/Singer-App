const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../services/storage.service");

const profileDir = path.join(__dirname, "../../uploads/profile");
const profileMetadataPath = path.join(profileDir, "profile.json");

function ensureProfileDir() {
  fs.mkdirSync(profileDir, { recursive: true });
  if (!fs.existsSync(profileMetadataPath)) {
    fs.writeFileSync(
      profileMetadataPath,
      JSON.stringify({ imageUrl: "" }),
      "utf8",
    );
  }
}

function readProfileImage() {
  ensureProfileDir();
  try {
    const raw = fs.readFileSync(profileMetadataPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.imageUrl || "";
  } catch (error) {
    return "";
  }
}

function writeProfileImage(imageUrl) {
  ensureProfileDir();
  fs.writeFileSync(profileMetadataPath, JSON.stringify({ imageUrl }), "utf8");
}

async function uploadProfilePhoto(req, res) {
  if (!req.file?.buffer) {
    return res
      .status(400)
      .json({ success: false, message: "Photo is required" });
  }

  try {
    const extension = path.extname(req.file.originalname || ".jpg") || ".jpg";
    const fileName = `profile-${Date.now()}${extension}`;
    const targetPath = path.join(profileDir, fileName);
    fs.writeFileSync(targetPath, req.file.buffer);

    let imageUrl = `/uploads/profile/${fileName}`;
    const uploadResult = await uploadFile(
      req.file.buffer.toString("base64"),
      fileName,
    );

    if (uploadResult?.url) {
      imageUrl = uploadResult.url;
    }

    writeProfileImage(imageUrl);

    return res.status(201).json({ success: true, imageUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to upload photo" });
  }
}

function getProfilePhoto(req, res) {
  const imageUrl = readProfileImage();
  return res.status(200).json({ success: true, imageUrl });
}

module.exports = { uploadProfilePhoto, getProfilePhoto };
