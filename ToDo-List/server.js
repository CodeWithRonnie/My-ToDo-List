// Import necessary modules
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API route for getting tasks (from your database)
app.get('/tasks', (req, res) => {
  const db = new sqlite3.Database('./todos.db'); // Connect to your database
  const query = 'SELECT * FROM tasks'; // Modify this according to your DB schema

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows); // Send tasks as JSON response
  });

  db.close(); // Close the database connection
});

// API route for adding a task
app.post('/task', (req, res) => {
  const { task, completionDate } = req.body;
  const db = new sqlite3.Database('./todos.db'); // Connect to the database

  const query = 'INSERT INTO tasks (task, completionDate) VALUES (?, ?)';
  db.run(query, [task, completionDate], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, task, completionDate });
  });

  db.close(); // Close the database connection
});

// Handle the root route, serving the main index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
