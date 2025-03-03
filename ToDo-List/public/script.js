document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.querySelector("#taskInput");
    const addTaskButton = document.getElementById("add-task-button");
    const activeTaskContainer = document.getElementById("tasks-active");
    const completedTaskContainer = document.getElementById("completedTasks");



    // Select the button and the container where tasks will be displayed
const loadTasksButton = document.getElementById('add-task-button');
const tasksContainer = document.getElementById('task-container');

// Add an event listener to the button to trigger the fetch request
loadTasksButton.addEventListener('click', () => {
  // Fetch data from the backend API (assuming your server is running on localhost:3000)
  fetch('http://localhost:3000')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(tasks => {
      // Once we have the data, we can display it on the page
      tasksContainer.innerHTML = ''; // Clear any existing tasks
      tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.textContent = task.task;
        tasksContainer.appendChild(taskElement);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});

    //loading tasks
    const loadTasks = async () => {
        const response = await fetch("/tasks");
        const tasks = await response.json();
        renderTasks(tasks);
    };

    //task rendeding
    const renderTasks = ({ active, completed }) => {
        activeTaskContainer.innerHTML = "";
        completedTaskContainer.innerHTML = "";

        active.forEach(task => createTaskElement(task, activeTaskContainer, true));
        completed.forEach(task => createTaskElement(task, completedTaskContainer, false));
    };

    //creating task elements
    const createTaskElement = (task, container, isActive) => {
        const li = document.createElement("li");
        li.textContent = task;
        li.onclick = () => isActive ?
        completeTask(task) : null;
        container.appendChild(li);
    };

    //adding a new task
    addTaskButton.addEventListener("click", async () => {
        const task = taskInput.value.trim();
        if (task) {
            const response = await fetch("https://localhost:3000/task",
             {method: "POST",
                 headers: {"Content-Type": "application/json"}, 
                 body: JSON.stringify({task}), })
                 .then(response => {
                    if (!response.ok){
                        throw new Error("Network response was not ok")
                    }
                    return response.json();
                 })
                 .then(data => {
                    console.log("Task added,");
                 })
                 .catch(error => {
                    console.error("There was a problem with fetch operation", error)
                 });

                }
       
    })

    //task marked as completed
    const completeTask = async (task) => {
        const response = await fetch("/tasks/complete", {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({task}),
        });
        renderTasks(await response.json());
    };

      
    
});