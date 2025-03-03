const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const   PORT = 3000;
const DATA_FILE = "tasks.json";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


//get tasks
const loasTasks = () => {
    if (!fs .existsSync(DATA_FILE)) return{
        active: [], completed: []};
        return JSON.parse(fs.readFileSync(DATA_FILE));
    
    };

    //saving tasks
    const saveTasks = (tasks) => {
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks));
    };

    //get all tasks
    app.get("/tasks", (req, res) => 
        res.json(loadTasks()));

    //adding of task
    app.post("/tasks", (req, res) => {
        const tasks = loadTasks();
        tasks.active.push(req.body.task);
        saveTasks(tasks);
        res.json(tasks);
    });

    //for tasks to be completed
    app.put("/tasks/complete", (req, res) => {
        const tasks = loadTasks();
        const index = tasks.active.indexOf(req.body.task);
        if (index > -1) {
            tasks.active.splice(index, 1);
            tasks.completed.push(req.body.task);
            saveTasks(tasks);
        }
        res.json(tasks);
    });

    //code to start the server
    app.listen(PORT, () => 
        console.log(`Server is running on http://localhost:${PORT}`));
