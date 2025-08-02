document.addEventListener("DOMContentLoaded", displayTasks);
document.getElementById("add-task").addEventListener("click", addTask);
function addTask() {
    let taskInput = document.getElementById("new-task").value.trim();
    if (taskInput) {
        let tasks = getTasksFromLocalStorage();
        tasks.push({ text: taskInput, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.getElementById("new-task").value = "";
        appendTask(taskInput, tasks.length - 1, false);
        toggleEmptyMessage();
        updateTaskCount(); 
    }
}

// Retrieve tasks from local storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Display tasks on the page
function displayTasks() {
    let tasks = getTasksFromLocalStorage();
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        appendTask(task.text, index, task.completed);
    });
    toggleEmptyMessage();
    updateTaskCount() ;
}





// Append a task to the task list
function appendTask(text, index, completed) {
    let taskList = document.getElementById("task-list");
    let taskLi = document.createElement("li");
    taskLi.className = "task-container";
    taskLi.id = task-${index};
    taskLi.style.transition = "all 0.3s ease";
    taskLi.style.display = "flex";
    taskLi.style.alignItems = "center";
    taskLi.style.padding = "0.5rem";
    taskLi.style.borderRadius = "10px";
    taskLi.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.1)";
    taskLi.style.marginBottom = "1em";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = check-${index};
    checkbox.className = "task-checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => toggleTaskCompletion(index));

    let taskText = document.createElement("span");
    taskText.id = task-text-${index};
    taskText.textContent = text;
    taskText.className = "task-label";
    if (completed) {
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "#aaa";
    }

    let editInput = document.createElement("input");
    editInput.id = edit-input-${index};
    editInput.type = "text";
    editInput.value = text;
    editInput.className = "editInput";
    editInput.style.display = "none";

    let btnContainer = document.createElement("div");
    btnContainer.className = "button-container";
    Object.assign(btnContainer.style, {
        display: "flex",
        gap: "5px",
        marginLeft: "auto",
    });

    let editBtn = createIconButton('<i class="fa-solid fa-pen"></i>', editBtn-${index}, "edit-button", "#f1c40f", () => enterEditMode(index));
    editBtn.className = "editBtn";
    // Hide edit button if task is completed
    if (completed) {
        editBtn.style.display = 'none';
    }
    let saveBtn = createIconButton("Save", saveBtn-${index}, "save-button", "#2ecc71", () => saveTask(index), true);
    let cancelBtn = createIconButton("Cancel", cancelBtn-${index}, "cancel-button", "#95a5a6", () => cancelEdit(index), true);
    let deleteBtn = createIconButton("✖", deleteBtn-${index}, "delete-button", "#e74c3c", () => removeTask(index));

    btnContainer.append(editBtn, saveBtn, cancelBtn, deleteBtn);
    taskLi.append(checkbox, taskText, editInput, btnContainer);
    taskList.appendChild(taskLi);

    setTimeout(() => {
        taskLi.classList.add("animate");
    }, 100);
}
function toggleTaskCompletion(index) {
    let tasks = getTasksFromLocalStorage();
    const isCompleted = !tasks[index].completed;
    tasks[index].completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    // Get the edit button and toggle its visibility
    const editBtn = document.getElementById(editBtn-${index});
    if (editBtn) {
        editBtn.style.display = isCompleted ? 'none' : 'inline-flex';
    }
    
    // Update the task text style
    const taskText = document.getElementById(task-text-${index});
    if (taskText) {
        taskText.style.textDecoration = isCompleted ? 'line-through' : 'none';
        taskText.style.color = isCompleted ? '#aaa' : 'inherit';
    }
    
    // Update the task in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Toggle the completion status of a task


// Enter edit mode for a task
function enterEditMode(index) {
    const taskLi = document.getElementById(task-${index});
    const taskText = document.getElementById(task-text-${index});
    const editInput = document.getElementById(edit-input-${index});
    const editBtn = document.getElementById(editBtn-${index});
    const saveBtn = document.getElementById(saveBtn-${index});
    const cancelBtn = document.getElementById(cancelBtn-${index});
    const checkbox = document.getElementById(check-${index});
    const deleteBtn = document.getElementById(deleteBtn-${index});
    
    // Add editing class to the task container
    taskLi.classList.add('editing');
    
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-flex';
    cancelBtn.style.display = 'inline-flex';
    checkbox.style.display = 'none';
    deleteBtn.style.display = 'none';
    editInput.focus();
    
    // Select all text in the input for easier editing
    editInput.setSelectionRange(0, editInput.value.length);
    editInput.style.display = 'inline-block';
    taskText.style.display = 'none';
}

// Save the edited task
function saveTask(index) {
    let editInput = document.getElementById(edit-input-${index});
    let tasks = getTasksFromLocalStorage();
    
    // If input is empty, remove the task
    if (editInput.value.trim() === '') {
        removeTask(index);
        return;
    }
    
    // Otherwise, update the task text
    tasks[index].text = editInput.value.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// Cancel the edit mode
function cancelEdit(index) {
    const taskLi = document.getElementById(task-${index});
    const taskText = document.getElementById(task-text-${index});
    const editInput = document.getElementById(edit-input-${index});
    const editBtn = document.getElementById(editBtn-${index});
    const saveBtn = document.getElementById(saveBtn-${index});
    const cancelBtn = document.getElementById(cancelBtn-${index});
    const checkbox = document.getElementById(check-${index});
    const deleteBtn = document.getElementById(deleteBtn-${index});
    
    // Reset the input value to the current task text
    editInput.value = taskText.textContent;
    
    // Show/hide elements
    taskLi.classList.remove('editing');
    taskText.style.display = 'inline';
    editInput.style.display = 'none';
    checkbox.style.display = 'inline-block';
    deleteBtn.style.display = 'inline-block';
    editBtn.style.display = 'inline-flex';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// Remove a task from the list
function removeTask(index) {
    let tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    updateTaskCount();
}

// Create an icon button
function createIconButton(icon, id, className, color, onClick, hidden = false) {
    let button = document.createElement("button");
    button.id = id;
    button.classList.add(className);
    button.innerHTML = <span style="font-size:12px;">${icon}</span>;
    Object.assign(button.style, {
        borderRadius: "5px",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",  
        justifyContent: "center",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        backgroundColor: color,
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    });
    button.onclick = onClick;
    if (hidden) button.style.display = "none";
    return button;
}

// Clear all tasks from the list
document.getElementById("clear-btn").addEventListener("click", clearAllTasks);
document.querySelector(".search-input").addEventListener("input", searchTasks);

// Search tasks based on input
function searchTasks() {
    let searchValue = document.querySelector(".search-input").value.toLowerCase();
    let tasks = document.querySelectorAll("#task-list li");
    tasks.forEach(task => {
        let taskText = task.textContent.toLowerCase();
        task.style.display = taskText.includes(searchValue) ? "flex" : "none";
    });
}

// Filter tasks based on status


// Update the task count
function updateTaskCount() {
    let tasks = getTasksFromLocalStorage();
    let activeTasks = tasks.filter(task => !task.completed).length; 
    let taskCount = document.getElementById("task-count");
    if (tasks.length === 0) {
        taskCount.style.display = "none"; 
    } else {
        taskCount.style.display = "inline";
        taskCount.innerHTML = ${activeTasks} item${activeTasks !== 1 ? 's' : ''} left; 
    }
}

// Add a new task to the list

// Clear all tasks from local storage and the list
function clearAllTasks() {
    localStorage.removeItem("tasks");
    document.getElementById("task-list").innerHTML = "";
    toggleEmptyMessage();
    updateTaskCount();
}

// Toggle the display of the empty message
function toggleEmptyMessage() {
    let tasks = getTasksFromLocalStorage();
    let emptyMessage = document.getElementById("empty-message");
    let taskList = document.getElementById("task-list");
    let filterButtons = document.querySelector(".filter-buttons");
    let hr = document.getElementById("task-hr");
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
    taskList.style.display = tasks.length === 0 ? "none" : "block";
    hr.style.display = tasks.length === 0 ? "none" : "block";
    filterButtons.style.display = tasks.length === 0 ? "none" : "flex";
}


document.getElementById("status-select").addEventListener("change", filterTasks);
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function () {
        document.getElementById("status-select").value = this.getAttribute("data-filter");
        filterTasks();
    });
});

function filterTasks() {
    let filterValue = document.getElementById("status-select").value;
    let tasks = getTasksFromLocalStorage();
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        if (filterValue === "all" || 
            (filterValue === "active" && !task.completed) || 
            (filterValue === "completed" && task.completed)) {
            appendTask(task.text, index, task.completed);
        }
    });
    toggleEmptyMessage();
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(.filter-btn[data-filter="${filterValue}"]).classList.add("active");
}



// Add event listener for Enter key to add task
const taskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTaskBtn.click();
    }
});
// Change the color of the add task button when input is not empty
taskInput.addEventListener("input", function () {
    if (taskInput.value.trim() !== "") {
        addTaskBtn.style.backgroundColor = "#2ecc71"; // Green color
    } else {
        addTaskBtn.style.backgroundColor = ""; // Default color
    }
});




function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    let themeToggle = document.getElementById("theme-toggle");
    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀";
        themeToggle.style.backgroundColor = "gainsboro"
    } else {
        themeToggle.textContent = "🌙";
         themeToggle.style.backgroundColor = "#444";
    }
}

document.getElementById("theme-toggle").addEventListener("click", toggleDarkMode);
