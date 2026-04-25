const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: `User ${username} successfully registered. You can now login.` });
});


// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});


// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }
});


// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Get all keys from the books object
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  // Iterate and filter by author
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: `No books found by author: ${author}` });
  }
});


// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Get all keys from the books object
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  // Iterate and filter by title
  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: `No books found with title: ${title}` });
  }
});


// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }
});


module.exports.general = public_users;