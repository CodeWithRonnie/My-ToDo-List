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

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.querySelector("#taskInput");
  const taskDateInput = document.querySelector("#taskDateInput");
  const addTaskButton = document.getElementById("add-task-button");
  const activeTaskContainer = document.getElementById("tasks-active");
  const completedTaskContainer = document.getElementById("completedTasks");
  const deletedTaskContainer = document.getElementById("deletedTasks");
  const incompleteTaskContainer = document.getElementById("incompleteTasks"); 

  let activeTasks = [];
  let completedTasks = [];
  let deletedTasks = [];
  let incompleteTasks = []; 

  const loadTasks = () => {
      renderTasks(activeTasks, activeTaskContainer, "Added on", "To be completed by", true);
      renderTasks(completedTasks, completedTaskContainer, "Completed on", null, false);
      renderTasks(deletedTasks, deletedTaskContainer, "Deleted on", null, false); 
      renderTasks(incompleteTasks, incompleteTaskContainer, "Incomplete since", "Due date", false); 
  };

  const renderTasks = (tasks, container, timestampLabel, completionLabel, isActive = false) => {
      container.innerHTML = "";
      tasks.forEach((task, index) => {
          const li = document.createElement("li");

          const taskName = document.createElement("div");
          taskName.textContent = task.name;

          if (task.state === "deleted") {
              taskName.style.textDecoration = "line-through";
              taskName.style.color = "#888";
              li.addEventListener("click", () => handleDeletedTaskClick(index));
          }

          const taskTimestamp = document.createElement("div");
          taskTimestamp.textContent = `${timestampLabel}: ${task.timestamp}`;
          taskTimestamp.style.fontSize = "0.8rem";
          taskTimestamp.style.color = "#ddd";

          li.appendChild(taskName);
          li.appendChild(taskTimestamp);

          if (completionLabel) {
              const taskCompletionDate = document.createElement("div");
              taskCompletionDate.textContent = `${completionLabel}: ${task.completionDate}`;
              taskCompletionDate.style.fontSize = "0.9rem";
              taskCompletionDate.style.color = "#f0f0f0";
              li.appendChild(taskCompletionDate);
          }

          if (isActive && task.state === "active") {
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.checked = false; 
              checkbox.addEventListener("change", () => markAsCompleted(task, index, checkbox));
              li.prepend(checkbox);
          }

          if (!isActive && task.state === "incomplete") {
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.checked = false; 
              li.prepend(checkbox);
          }

          if (isActive && task.state === "active") {
              const calendarButton = document.createElement("button");
              calendarButton.textContent = "Add to Calendar";
              calendarButton.addEventListener("click", (e) => {
                  e.stopPropagation();
                  addToCalendar(task);
              });
              li.appendChild(calendarButton);
          }

          if (task.state === "completed") {
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.checked = true;
              li.prepend(checkbox);
          }

          if (task.state === "completed") {
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.classList.add("delete-button");
              deleteButton.addEventListener("click", (e) => {
                  e.stopPropagation();
                  deleteTask(task, index);
              });
              li.appendChild(deleteButton);
          }

          container.appendChild(li);
      });
  };

  const markAsCompleted = (task, index, checkbox) => {
      if (checkbox.checked) {
          task.state = "completed";
          completedTasks.push(task);
          activeTasks.splice(index, 1); 
          loadTasks();
      }
  };

  const checkOverdueTasks = () => {
      const now = new Date();
      activeTasks.forEach((task, index) => {
          const dueDate = new Date(task.completionDate);
          if (dueDate < now) {
              task.state = "incomplete";
              incompleteTasks.push(task);
              activeTasks.splice(index, 1);
          }
      });
      loadTasks();
  };

  const addToCalendar = (task) => {
      const taskDate = new Date(task.completionDate);
      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.name)}&dates=${taskDate.toISOString().replace(/-|:|\.\d+/g, "")}/${taskDate.toISOString().replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(task.notes)}&location=&sf=true&output=xml`;
      window.open(calendarUrl, "_blank");
  };

  // Add new task
  addTaskButton.addEventListener("click", () => {
      const taskName = taskInput.value.trim();
      const completionDate = taskDateInput.value;

      if (taskName && completionDate) {
          const newTask = {
              name: taskName,
              timestamp: new Date().toLocaleString(),
              completionDate: completionDate,
              state: "active",
              notes: ""
          };

          activeTasks.push(newTask);
          taskInput.value = "";
          taskDateInput.value = "";
          loadTasks();
      } else {
          alert("Please fill in both the task name and completion date.");
      }
  });

  // Delete task permanently
  const deleteTask = (task, index) => {
      const fromActive = activeTasks.findIndex(t => t.name === task.name);
      if (fromActive !== -1) {
          activeTasks.splice(fromActive, 1);
      }

      const fromCompleted = completedTasks.findIndex(t => t.name === task.name);
      if (fromCompleted !== -1) {
          completedTasks.splice(fromCompleted, 1);
      }

      const deletedTask = { ...task, state: "deleted", timestamp: new Date().toLocaleString() };
      deletedTasks.push(deletedTask);
      loadTasks();
  };

  const handleDeletedTaskClick = (index) => {
      const deletedTask = deletedTasks[index];
      alert(`Task "${deletedTask.name}" has been deleted.`);
  };

  loadTasks();
  checkOverdueTasks();
});
