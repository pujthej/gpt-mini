import 'dotenv/config';
import OpenAI from "openai";

export default async function (req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Server misconfigured: missing OpenAI API Key" });
    }

    const { message } = req.body || {};
    const prompt = typeof message === "string" ? message.trim() : "";
    if (!prompt) {
      return res.status(400).json({ error: "Please include a non-empty 'message' string." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: "You are a helpful assistant.",
      input: prompt,
    });

    return res.status(200).json({ reply: response.output_text || "No response text." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Unknown error" });
  }
}
