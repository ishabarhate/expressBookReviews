const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User ${username} successfully registered. You can now login.` });
});


// Task 1 & Task 10: Get the book list using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(JSON.stringify(response.data, null, 2));
  } catch (error) {
    // Fallback to direct books object if axios call fails
    return res.status(200).json(JSON.stringify(books, null, 2));
  }
});


// Task 2 & Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Fallback to direct lookup
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
    }
  }
});


// Task 3 & Task 12: Get book details based on Author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Fallback to direct lookup
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

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
  }
});


// Task 4 & Task 13: Get all books based on Title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    // Fallback to direct lookup
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

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