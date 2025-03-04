const express = require("express");
const cors = require("cors");
const fs = require("fs");

const PORT = 5100;
const DATA_FILE = "./mock_db/data.json";
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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
