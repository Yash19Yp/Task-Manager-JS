"use strict";

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(tasksToRender) {
    taskList.innerHTML = '';
    tasksToRender.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task';
        li.style.backgroundColor = getRandomColor(); // Assign random color
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
        li.scrollIntoView(); // Scroll the new task into view
    });
}

function getRandomColor() {
    const colors = ['#f8b400', '#7cb342', '#039be5', '#f06292', '#9575cd', '#66bb6a']; // Array of predefined colors
    return colors[Math.floor(Math.random() * colors.length)];
}

function addTask(event) {
    event.preventDefault();
    const newTask = {
        description: document.getElementById('taskDescription').value,
        assignedTo: document.getElementById('assignedTo').value,
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        category: document.getElementById('category').value
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks(tasks);
    taskForm.reset();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('assignedTo').value = task.assignedTo;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    document.getElementById('category').value = task.category;
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(tasks);
    // Change submit button to update button temporarily
    taskForm.querySelector('button[type="submit"]').textContent = 'Update Task';
    taskForm.removeEventListener('submit', addTask);
    taskForm.addEventListener('submit', function updateTask(event) {
        event.preventDefault();
        addTask(event); // Reuse addTask function to update existing task
        taskForm.reset();
        taskForm.querySelector('button[type="submit"]').textContent = 'Add Task';
        taskForm.removeEventListener('submit', updateTask);
        taskForm.addEventListener('submit', addTask);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(tasks);
}

function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        Object.values(task).some(value => 
            value.toLowerCase().includes(searchTerm)
        )
    );
    renderTasks(filteredTasks);
}

function sortTasks(sortBy) {
    switch (sortBy) {
        case 'dueDate':
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'priority':
            tasks.sort((a, b) => {
                const priorityOrder = { Low: 1, Medium: 2, High: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        default:
            // Default to sorting by description
            tasks.sort((a, b) => a.description.localeCompare(b.description));
            break;
    }
    renderTasks(tasks);
}

taskForm.addEventListener('submit', addTask);
searchInput.addEventListener('input', searchTasks);

renderTasks(tasks);
