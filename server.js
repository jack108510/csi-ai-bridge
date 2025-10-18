import 'dotenv/config';
import express from "express";
import OpenAI from "openai";
import axios from "axios";

const app = express();
app.use(express.json());

// Debug: confirm environment variables
console.log("🔍 ENV CHECK:", {
  hasOpenAI: !!process.env.OPENAI_API_KEY,
  port: process.env.PORT,
  n8nBase: process.env.N8N_BASE_LIVE,
  webhookID: process.env.N8N_WEBHOOK_ID
});

// Load API key and validate
const apiKey = (process.env.OPENAI_API_KEY || "").replace(/['"]/g, "");
if (!apiKey) {
  console.error("❌ OPENAI_API_KEY not found. Check Render → Environment → Runtime Variables.");
  process.exit(1);
}

// Initialize OpenAI client
const client = new OpenAI({ apiKey });

// Health check route (for Render uptime checks)
app.get("/", (req, res) => {
  res.send({
    status: "ok",
    openaiKeyLoaded: !!process.env.OPENAI_API_KEY,
    webhook: `${process.env.N8N_BASE_LIVE}/${process.env.N8N_WEBHOOK_ID}`,
  });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!userMsg) return res.status(400).send({ error: "Missing message" });

    console.log

