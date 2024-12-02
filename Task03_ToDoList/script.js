const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');

let editTodo = null;

// Add a new task
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length <= 0) {
        alert("You must write something in your to do");
        return false;
    }

    const timestamp = new Date().toLocaleString(); // Get current date and time
    if (addBtn.value === "Edit") {
        editTodo.target.previousElementSibling.innerHTML = `${inputText} <span class="timestamp">[${timestamp}]</span>`;
        updateLocalTodos(editTodo.target.dataset.id, inputText);
        addBtn.value = "Add";
        inputBox.value = "";
    } else {
        const taskId = Date.now().toString(); // Unique task ID
        createTask(inputText, taskId, timestamp, "pending");
        saveLocalTodos({ id: taskId, text: inputText, status: "pending", timestamp });
        inputBox.value = "";
    }
};

// Create a task element
const createTask = (text, id, timestamp, status) => {
    const li = document.createElement("li");
    li.dataset.id = id;

    // Task description with timestamp
    const p = document.createElement("p");
    p.innerHTML = `${text} <span class="timestamp">[${timestamp}]</span>`;
    li.appendChild(p);

    // Complete button
    if (status === "pending") {
        const completeBtn = document.createElement("button");
        completeBtn.innerText = "Complete";
        completeBtn.classList.add("btn", "completeBtn");
        completeBtn.onclick = () => markComplete(id);
        li.appendChild(completeBtn);
    }

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    editBtn.onclick = () => editTask(id, text);
    li.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Remove";
    deleteBtn.classList.add("btn", "deleteBtn");
    deleteBtn.onclick = () => deleteTask(id, status);
    li.appendChild(deleteBtn);

    // Append task to the appropriate list
    if (status === "pending") {
        pendingList.appendChild(li);
    } else {
        completedList.appendChild(li);
    }
};

// Mark task as complete
const markComplete = (id) => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    const task = todos.find(todo => todo.id === id);
    task.status = "completed";
    localStorage.setItem("todos", JSON.stringify(todos));

    refreshLists();
};

// Edit a task
const editTask = (id, text) => {
    inputBox.value = text;
    inputBox.focus();
    addBtn.value = "Edit";
    editTodo = { target: document.querySelector(`[data-id='${id}'] p`) };
};

// Delete a task
const deleteTask = (id, status) => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    const updatedTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    refreshLists();
};

// Save a task to local storage
const saveLocalTodos = (todo) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Update task text in local storage
const updateLocalTodos = (id, newText) => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    const task = todos.find(todo => todo.id === id);
    task.text = newText;
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Refresh task lists
const refreshLists = () => {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(todo => {
        createTask(todo.text, todo.id, todo.timestamp, todo.status);
    });
};

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', refreshLists);
addBtn.addEventListener('click', addTodo);
