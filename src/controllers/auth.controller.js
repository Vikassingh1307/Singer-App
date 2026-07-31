const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = process.env.JWT_SECRET || "fallback-secret";
const memoryUsers = [];

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

async function findUserByIdentifier(usernameOrEmail, email) {
  const query = usernameOrEmail || email;

  if (isDatabaseReady()) {
    try {
      return await userModel.findOne({
        $or: [{ username: query }, { email: query }],
      });
    } catch (error) {
      console.warn(
        "Falling back to in-memory auth because MongoDB lookup failed:",
        error.message,
      );
    }
  }

  return (
    memoryUsers.find(
      (user) => user.username === query || user.email === query,
    ) || null
  );
}

async function createUserWithFallback({ username, email, passwordHash, role }) {
  if (isDatabaseReady()) {
    try {
      return await userModel.create({
        username,
        email,
        password: passwordHash,
        role,
      });
    } catch (error) {
      console.warn(
        "Falling back to in-memory auth because MongoDB create failed:",
        error.message,
      );
    }
  }

  const user = {
    _id: new mongoose.Types.ObjectId(),
    username,
    email,
    password: passwordHash,
    role,
  };

  memoryUsers.push(user);
  return user;
}

async function registerUser(req, res) {
  const { username, email, password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const isUserAlreadyExists = await findUserByIdentifier(username, email);

    if (isUserAlreadyExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await createUserWithFallback({
      username,
      email,
      passwordHash: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      jwtSecret,
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res
      .status(400)
      .json({ message: "Username or email and password are required" });
  }

  try {
    const user = await findUserByIdentifier(username, email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      jwtSecret,
    );

    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
}

module.exports = { registerUser, loginUser };
