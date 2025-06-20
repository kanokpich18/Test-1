const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgYtidoC8yH6L7flsSuCoLAEPA-bkH7s2dqZxo_OQyiZT8RnALf1-W0Mz-0L0axtzmTA/exec";

app.post("/proxy", async (req, res) => {
  console.log("✅ ได้รับข้อมูลจากหน้าเว็บ:", JSON.stringify(req.body));

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log("📨 ตอบกลับจาก Apps Script:", text);

    if (!response.ok) {
      return res.status(response.status).send("⛔ Apps Script Error: " + text);
    }

    res.send(text);
  } catch (error) {
    console.error("🔥 เกิดข้อผิดพลาดใน Proxy:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`✅ Proxy server running at http://localhost:${port}`);
});
