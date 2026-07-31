const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const musicModel = mongoose.model("Music", musicSchema);

module.exports = musicModel;
