const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "../../uploads");
const musicDataFile = path.join(storageDir, "music-data.json");

function ensureStorage() {
  fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(musicDataFile)) {
    fs.writeFileSync(musicDataFile, "[]", "utf8");
  }
}

function readPersistedMusic() {
  ensureStorage();

  try {
    const raw = fs.readFileSync(musicDataFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writePersistedMusic(items) {
  ensureStorage();
  fs.writeFileSync(musicDataFile, JSON.stringify(items, null, 2), "utf8");
}

function addPersistedMusic(item) {
  const items = readPersistedMusic();
  items.push(item);
  writePersistedMusic(items);
  return items;
}

function updatePersistedMusic(id, updates) {
  const items = readPersistedMusic();
  const item = items.find((entry) => entry._id?.toString() === id?.toString());

  if (!item) {
    return null;
  }

  Object.assign(item, updates);
  writePersistedMusic(items);
  return item;
}

function removePersistedMusic(id) {
  const items = readPersistedMusic();
  const filtered = items.filter(
    (entry) => entry._id?.toString() !== id?.toString(),
  );
  writePersistedMusic(filtered);
  return filtered;
}

module.exports = {
  readPersistedMusic,
  writePersistedMusic,
  addPersistedMusic,
  updatePersistedMusic,
  removePersistedMusic,
};
