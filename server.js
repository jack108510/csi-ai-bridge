import 'dotenv/config';
import express from "express";
import OpenAI from "openai";
import axios from "axios";

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: userMsg }]
  });

  const reply = completion.choices[0].message.content;

  await axios.post("http://localhost:5678/webhook/b807f075-cd1e-41d2-a031-9155b3ec88d7", {
    query: userMsg,
    gpt_response: reply
  });

  res.send({ reply });
});

app.listen(3000, () => console.log("Local ChatGPT listening on http://localhost:3000"));

