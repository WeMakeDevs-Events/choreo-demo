import express from "express";
import cache from "./cache.mjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = process.env.SECRET_KEY;

// Simple security check to ensure the SECRET_KEY is loaded
if (!SECRET_KEY) {
  console.error("ERROR: SECRET_KEY environment variable is not set!");
  process.exit(1); // Exit the application if the secret is missing
}

// Middleware to validate requests using SECRET_KEY (example)
app.use((req, res, next) => {
  const providedKey = req.headers["x-secret-key"];
  if (providedKey !== SECRET_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid secret key" });
  }
  next();
});

// Add a book - request body should contain a title, status, and author
app.post("/reading-list/books", (req, res) => {
  const { title, author, status } = req.body;
  const uuid = uuidv4();
  if (!(status === "read" || status === "to_read" || status === "reading")) {
    return res.status(400).json({
      error: "Status is invalid. Accepted statuses: read | to_read | reading",
    });
  }
  if (!title || !author || !status) {
    return res.status(400).json({ error: "Title, Status, or Author is empty" });
  }
  const value = { uuid, title, author, status };
  cache.set(uuid, value, CACHE_TTL); // Use the CACHE_TTL environment variable
  return res.status(201).json({ uuid, title, author });
});

// Update status of a book by uuid
app.put("/reading-list/books/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  const { status } = req.body;
  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "Missing or invalid UUID" });
  }
  if (!cache.has(uuid)) {
    return res.status(404).json({ error: "UUID does not exist" });
  }
  if (!(status === "read" || status === "to_read" || status === "reading")) {
    return res.status(400).json({
      error: "Status is invalid. Accepted statuses: read | to_read | reading",
    });
  }
  const value = cache.get(uuid);
  value.status = status;
  cache.set(uuid, value);
  return res.json({ uuid, status });
});

// Get the list of books
app.get("/reading-list/books", (_, res) => {
  const keys = cache.keys();
  const allData = {};
  for (const key of keys) {
    allData[key] = cache.get(key);
  }
  return res.json(allData);
});

// Get a book by uuid
app.get("/reading-list/books/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "Missing or invalid UUID" });
  }
  if (!cache.has(uuid)) {
    return res.status(404).json({ error: "UUID does not exist" });
  }
  const value = cache.get(uuid);
  return res.json(value);
});

// Delete a book by uuid
app.delete("/reading-list/books/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid || typeof uuid !== "string") {
    return res.status(400).json({ error: "Missing or invalid UUID" });
  }
  if (!cache.has(uuid)) {
    return res.status(404).json({ error: "UUID does not exist" });
  }
  cache.del(uuid);
  return res.json({ uuid });
});

// Health check
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

// Error handling middleware
app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

// Catch-all for undefined routes
app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "The requested resource does not exist on this server" });
});

export default app;
