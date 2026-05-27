const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/debug", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
  });
});

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

app.get("/", (req, res) => {
  res.json({
    status: "running"
  });
});

app.post("/add_detection", async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const {
      class: detectionClass,
      lat,
      lon,
      time
    } = req.body;

    const conn =
      await mysql.createConnection(dbConfig);

    console.log("DATABASE CONNECTED");

    await conn.execute(
      `
      INSERT INTO detections
      (
        detection_class,
        latitude,
        longitude,
        detection_time
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        detectionClass,
        lat,
        lon,
        time
      ]
    );

    await conn.end();

    res.json({
      success: true
    });

  } catch (err) {

    console.error("FULL ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }
});

const PORT =
  process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});