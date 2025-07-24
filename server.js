require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { choosePreferredCalendar } = require("./decisionEngine");

console.log("Using Event-Type A:", process.env.CALENDLY_EVENT_TYPE_URI_A);
console.log("Using Event-Type B:", process.env.CALENDLY_EVENT_TYPE_URI_B);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

const {
  CALENDLY_API_KEY,
  CALENDLY_EVENT_TYPE_URI_A,
  CALENDLY_EVENT_TYPE_URI_B,
  CALENDLY_EMBED_URL_A,
  CALENDLY_EMBED_URL_B,
} = process.env;

if (
  !CALENDLY_API_KEY ||
  !CALENDLY_EVENT_TYPE_URI_A ||
  !CALENDLY_EVENT_TYPE_URI_B ||
  !CALENDLY_EMBED_URL_A ||
  !CALENDLY_EMBED_URL_B
) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

app.get("/api/choose", async (req, res) => {
  try {
    const result = await choosePreferredCalendar(
      CALENDLY_EVENT_TYPE_URI_A,
      CALENDLY_EVENT_TYPE_URI_B,
      CALENDLY_EMBED_URL_A,
      CALENDLY_EMBED_URL_B,
      CALENDLY_API_KEY
    );
    res.json(result);
  } catch (err) {
    console.error("❌ /api/choose failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
