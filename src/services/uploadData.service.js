function bufferToDataUri(buffer, mimeType = "application/octet-stream") {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

module.exports = { bufferToDataUri };
