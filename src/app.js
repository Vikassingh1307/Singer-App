const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, status: "ok", message: "Backend is running" });
});
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the music backend API",
    endpoints: [
      "GET /health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/music",
      "GET /api/music/:id",
      "POST /api/music/upload",
      "PATCH /api/music/:id",
      "DELETE /api/music/:id",
    ],
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/profile", profileRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;
