const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // CORS for handling cross-origin requests

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoApp')
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));

// Define Task schema and model
const taskSchema = new mongoose.Schema({
    name: String,
    timestamp: String,
    completionDate: String,
    state: String,
    notes: String,
});

const Task = mongoose.model('Task', taskSchema);

// API route to get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch all tasks from DB
        res.json(tasks); // Return tasks as JSON
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API route to add a new task
app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body); // Create a new task object from the request body
        await newTask.save(); // Save the task to the database
        res.json(newTask); // Return the new task as JSON
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API route to update task status to completed
app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task); // Return the updated task
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API route to delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.json(task); // Return the deleted task
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
