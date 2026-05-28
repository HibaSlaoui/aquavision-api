const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.json({
    status: "running",
  });
});

app.post("/add_detection", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const {
      class: detectionClass,
      lat,
      lon,
      time,
    } = req.body;

    await pool.query(
      `
      INSERT INTO detections
      (
        detection_class,
        latitude,
        longitude,
        detection_time
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        detectionClass,
        lat,
        lon,
        time,
      ]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});