const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (exists in users array)
const isValid = (username) => {
  const userList = users.filter((user) => user.username === username);
  return userList.length > 0;
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  const validUsers = users.filter((user) => 
    user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username exists
  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found. Please register first." });
  }

  // Validate username and password
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign(
      { username },
      "access",
      { expiresIn: "1h" }
    );

    // Save token in session
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: `User ${username} successfully logged in`, accessToken });
  } else {
    return res.status(401).json({ message: "Invalid password. Please try again." });
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // Retrieved from session via middleware

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter" });
  }

  // Add or modify the review (keyed by username)
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} has been added/updated by ${username}`,
    reviews: books[isbn].reviews
  });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Retrieved from session via middleware

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: `No book found with ISBN: ${isbn}` });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: `No review found for user ${username} on ISBN: ${isbn}` });
  }

  // Delete only the review belonging to the logged-in user
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for ISBN ${isbn} by ${username} has been deleted`,
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;