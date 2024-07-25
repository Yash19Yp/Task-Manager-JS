"use strict";

// To get an element by ID
const $ = (ele) => document.getElementById(ele);

// To get data from localStorage
const getFromLocalStorage = (item) => {
  return JSON.parse(localStorage.getItem(item)) || [];
};

// To set data to localStorage
const setToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Retrieve tasks from localStorage
let tasks = getFromLocalStorage("tasks");

// Get Elements form DOM tree
const taskForm = $("taskForm");
const taskList = $("taskList");
const searchInput = $("searchInput");

// To render tasks to the DOM
const displayTasks = (tasksToRender) => {
  taskList.innerHTML = "";
  tasksToRender.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task";
    li.style.backgroundColor = task.color;
    li.innerHTML = `
      <h3>${task.description}</h3>
      <p><strong>Assigned to:</strong> ${task.assignedTo}</p>
      <p><strong>Due Date:</strong> ${task.dueDate}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Category:</strong> ${task.category}</p>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
};

// To get a random color from a predefined list
const getRandomColor = () => {
  const colors = [
    "#f8b400",
    "#7cb342",
    "#039be5",
    "#f06292",
    "#9575cd",
    "#66bb6a",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// To add a new task
const addTask = (e) => {
  e.preventDefault();
  const newTask = {
    description: $("description").value,
    assignedTo: $("assignedTo").value,
    dueDate: $("dueDate").value,
    priority: $("priority").value,
    category: $("category").value,
    color: getRandomColor(), // Assign a random color when the task created
  };
  tasks.push(newTask);
  setToLocalStorage();
  displayTasks(tasks);
  taskForm.reset();
};

// To edit an existing task
const editTask = (index) => {
  const task = tasks[index];
  $("description").value = task.description;
  $("assignedTo").value = task.assignedTo;
  $("dueDate").value = task.dueDate;
  $("priority").value = task.priority;
  $("category").value = task.category;
  $("description").focus();

  const submitButton = taskForm.querySelector('button[type="submit"]');
  submitButton.textContent = "Update Task";

  // Remove previous event listener to prevent duplicates
  taskForm.removeEventListener("submit", addTask);
  taskForm.addEventListener("submit", function updateTask(e) {
    e.preventDefault();
    const updatedTask = {
      ...task,
      description: $("description").value,
      assignedTo: $("assignedTo").value,
      dueDate: $("dueDate").value,
      priority: $("priority").value,
      category: $("category").value,
    };
    tasks[index] = updatedTask;
    setToLocalStorage();
    displayTasks(tasks);
    taskForm.reset();
    submitButton.textContent = "Add Task";
    taskForm.removeEventListener("submit", updateTask);
    taskForm.addEventListener("submit", addTask);
  });
};

// To delete a task
const deleteTask = (index) => {
  tasks.splice(index, 1);
  setToLocalStorage();
  displayTasks(tasks);
};

// To search tasks based on the search input
const searchTasks = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some((value) =>
      value.toLowerCase().includes(searchTerm)
    )
  );
  displayTasks(filteredTasks);
};

// To sort tasks by a filter type
const sortTasks = (sortBy) => {
  switch (sortBy) {
    case "dueDate":
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "priority":
      tasks.sort((a, b) => {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      break;
    default:
      tasks.sort((a, b) => a.description.localeCompare(b.description));
      break;
  }
  displayTasks(tasks);
};

// Event listeners for form submission and search input
taskForm.addEventListener("submit", addTask);
searchInput.addEventListener("input", searchTasks);

// To Display the Tasks on Page load
displayTasks(tasks);

// Make sortTasks function globally available
window.sortTasks = sortTasks;
