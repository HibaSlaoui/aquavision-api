const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

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

    const {
      class: detectionClass,
      lat,
      lon,
      time
    } = req.body;

    const conn =
      await mysql.createConnection(dbConfig);

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

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
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