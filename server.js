const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const PORT = 5100;
const DATA_FILE = "./mock_db/data.json";
const SECRET_KEY = "your_secret_key";

const users = [
  { username: "admin", password: "password123" },
  { username: "user", password: "test123" },
];

const app = express();
app.use(cors());
app.use(express.json());

const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData);
};

app.get("/items", (req, res) => {
  res.json(readData());
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
