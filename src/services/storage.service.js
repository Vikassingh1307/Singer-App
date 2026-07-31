const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

async function uploadFile(file, fileName = "music_" + Date.now()) {
  if (
    !process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    return { url: null, filePath: null };
  }

  return imagekit.upload({
    file,
    fileName,
    folder: "yt-complete-backend/music",
  });
}

module.exports = { uploadFile };
