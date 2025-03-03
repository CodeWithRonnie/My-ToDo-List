document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.querySelector("#taskInput");
    const addTaskButton = document.getElementById("add-task-button");
    const activeTaskContainer = document.getElementById("tasks-active");
    const completedTaskContainer = document.getElementById("completedTasks");

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
            const response = await fetch("/task", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({task}), });
            renderTasks(await response.json());
            taskInput.value
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