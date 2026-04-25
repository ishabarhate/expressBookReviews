const express = require("express");
const public_users = express.Router();
const books = require("./booksdb.js");          // ← ./  not ../
let users = require("./auth_users.js").users;
let isValid = require("./auth_users.js").isValid;

// ─── Task 1 – Get all books ─────────────────────────────
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// ─── Task 2 – Get by ISBN ────────────────────────────────
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─── Task 3 – Get by Author ──────────────────────────────
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(
    (b) => b.author.toLowerCase() === author.toLowerCase()
  );
  return res.status(200).json(result);
});

// ─── Task 4 – Get by Title ───────────────────────────────
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const result = Object.values(books).filter(
    (b) => b.title.toLowerCase() === title.toLowerCase()
  );
  return res.status(200).json(result);
});

// ─── Task 5 – Get Reviews ────────────────────────────────
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// ─── Task 6 – Register New User ──────────────────────────
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(404).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

module.exports.general = public_users;