import express from "express";
import Book from './bookModel.mjs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a book
app.post("/reading-list/books", async (req, res) => {
  const { title, author, status } = req.body;
  if (!['read', 'to_read', 'reading'].includes(status)) {
    return res.status(400).json({
      error: "Status is invalid. Accepted statuses: read | to_read | reading",
    });
  }
  if (!title || !author || !status) {
    return res.status(400).json({ error: "Title, Status, or Author is empty" });
  }
  try {
    const book = await Book.create({ title, author, status });
    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get the list of all books
app.get("/reading-list/books", async (_, res) => {
  try {
    const books = await Book.findAll();
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get a book by UUID
app.get("/reading-list/books/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const book = await Book.findByPk(uuid);
    if (!book) {
      return res.status(404).json({ error: "UUID does not exist" });
    }
    return res.json(book);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update a book's status by UUID
app.put("/reading-list/books/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const { status } = req.body;
  try {
    const book = await Book.findByPk(uuid);
    if (book) {
      book.status = status;
      await book.save();
      return res.json({ uuid, status });
    }
    return res.status(404).json({ error: "UUID not found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a book by UUID
app.delete("/reading-list/books/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const count = await Book.destroy({ where: { uuid } });
    if (count === 0) {
      return res.status(404).json({ error: "UUID not found" });
    }
    return res.json({ uuid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});

export default app;
