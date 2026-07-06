import { addTask, countCompletedTasks, TaskManager, taskList } from './app.js';
import { loadTasksFromStorage, saveTasksToStorage } from './storage.js';

// Which tasks are visible in the list (all / pending / completed).
let currentFilter = 'all';

// Escape user text before inserting it into the DOM (prevents HTML injection).
function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

// Turn a numeric priority (1-5) into its own label + colour class, in sequence.
function priorityLabel(priority) {
  const levels = {
    1: { text: 'Low', cls: 'p1' },
    2: { text: 'Low', cls: 'p2' },
    3: { text: 'Medium', cls: 'p3' },
    4: { text: 'High', cls: 'p4' },
    5: { text: 'High', cls: 'p5' }
  };
  return levels[Number(priority)] ?? { text: `Level ${priority}`, cls: 'p3' };
}

// All selectors live in one place to avoid repeated selector mistakes.
function selectElements(documentRef = document) {
  return {
    form: documentRef.querySelector('#task-form'),
    titleInput: documentRef.querySelector('#title'),
    descriptionInput: documentRef.querySelector('#description'),
    priorityInput: documentRef.querySelector('#priority'),
    taskListContainer: documentRef.querySelector('#task-list'),
    filterSelect: documentRef.querySelector('#filter'),
    clearCompletedButton: documentRef.querySelector('#clear-completed')
  };
}

// Persist the current task list to localStorage as plain JSON objects.
function saveState() {
  return saveTasksToStorage(taskList.map((task) => task.toObject()));
}







// Missing: proper DOM selectors
function setupEventListeners() {
    // Wrong selector method
    var addButton = document.getElementById(".add-task-btn");  // Wrong - mixing ID and class
    var taskInput = document.querySelector("task-input");  // Missing #
    
    // Missing: null checks before adding listeners
    addButton.addEventListener("click", handleAddTask);
    
    // Missing: other event listeners for form submission, etc.
}

// Function with DOM manipulation errors
function handleAddTask() {
    var titleInput = document.getElementById("title");
    var descInput = document.getElementById("description");
    
    // No validation
    // Should use event.preventDefault() if form
    
    var title = titleInput.value;
    var description = descInput.value;
    
    // Missing: priority input
    
    addTask(title, description, 1);
    displayTasks();
    
    // Missing: clear inputs after adding
}

// Function that should use better selectors
function displayTasks() {
    var container = document.getElementById("task-list");
    
    // Should clear existing content first
    // Missing: null check
    
    // Inefficient - should use template literals and insertAdjacentHTML
    for (var i = 0; i < taskList.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = "<h3>" + taskList[i].title + "</h3>";
        div.innerHTML = div.innerHTML + "<p>" + taskList[i].description + "</p>";
        container.appendChild(div);
        
        // Missing: task ID, completion status, event handlers for delete/complete
    }
}

// Function with event handling issues
function handleTaskClick(event) {
    // Missing: event.target check
    // Missing: proper event delegation
    
    var taskId = event.target.id;  // Wrong way to get task ID
    
    // Should toggle task completion
    console.log("Task clicked: " + taskId);
}

// Missing: JSON conversion functions
// Missing: functions to save/load tasks from localStorage

// Initialize (wrong placement - should use DOMContentLoaded)
setupEventListeners();
