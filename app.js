import {
  assertArray,
  createTaskObject,
  formatTaskName,
  generateRandomId,
  isHighPriority,
  normalizePriority
} from './utils.js';

export const taskList = [];


export class Task {
  constructor(title, description = '', priority = 3, id = generateRandomId()) {
    const preparedTask = createTaskObject(title, description, priority);

    if (typeof id !== 'string' && typeof id !== 'number') {
      throw new TypeError('Task id must be a string or number.');
    }

    this.id = id;
    this.title = preparedTask.title;
    this.description = preparedTask.description;
    this.priority = preparedTask.priority;
    this.completed = false;
    this.createdAt = new Date().toISOString();
  }

  toggleCompletion(forceValue) {
    if (forceValue !== undefined && typeof forceValue !== 'boolean') {
      throw new TypeError('Completion value must be boolean when provided.');
    }

    this.completed = forceValue ?? !this.completed;
    return this.completed;
  }

  getInfo() {
    const status = this.completed ? 'completed' : 'pending';
    return `Task: ${this.title} - Priority: ${this.priority} - Status: ${status}`;
  }

  toObject() {
    const { id, title, description, priority, completed, createdAt } = this;
    return { id, title, description, priority, completed, createdAt };
  }
}


export class SubTask extends Task {
  constructor(title, description = '', priority = 3, parentTask, id = generateRandomId('subtask')) {
    super(title, description, priority, id);

    if (!(parentTask instanceof Task) && typeof parentTask !== 'string' && typeof parentTask !== 'number') {
      throw new TypeError('SubTask parent must be a Task instance, string id, or numeric id.');
    }

    this.parentTaskId = parentTask instanceof Task ? parentTask.id : parentTask;
  }

  getInfo() {
    return `${super.getInfo()} - Parent: ${this.parentTaskId}`;
  }
}








// Functions with errors

// Function with no error handling
function addTask(title, description, priority) {
    var newTask = new Task(title, description, priority);  // Should use const
    taskList.push(newTask);
    taskCounter++;
    return newTask;
}

// Function with incorrect loop
function displayAllTasks() {
    // Wrong loop - should use for-of
    for (var i = 0; i <= taskList.length; i++) {  // Off-by-one error
        console.log(taskList[i].title);
    }
}

// Function missing parameter
function findTaskByTitle() {
    // Missing: title parameter
    // Wrong loop construct
    var i = 0;
    while (i < taskList.length) {
        if (taskList[i].title == title) {  // Should use ===
            return taskList[i];
        }
        // Missing: i++
    }
    return undefined;
}

// Function with type checking issues
function updateTaskPriority(taskId, newPriority) {
    // Missing: typeof check for parameters
    // Missing: null/undefined validation
    
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id = taskId) {  // Wrong operator (= instead of ===)
            taskList[i].priority = newPriority;
            return true;
        }
    }
    return false;
}

// Function that should use destructuring but doesn't
function getTaskDetails(task) {
    // Should destructure task properties
    var title = task.title;
    var description = task.description;
    var priority = task.priority;
    var completed = task.completed;
    
    return {
        title: title,
        description: description,
        priority: priority,
        completed: completed
    };
}

// Function missing spread/rest operators
function mergeTasks(list1, list2) {
    // Should use spread operator
    var merged = [];
    for (var i = 0; i < list1.length; i++) {
        merged.push(list1[i]);
    }
    for (var i = 0; i < list2.length; i++) {
        merged.push(list2[i]);
    }
    return merged;
}

// Recursive function with error
function countCompletedTasks(tasks, index) {
    // Missing: base case check
    // Missing: null/undefined check
    
    if (tasks[index].completed) {
        return 1 + countCompletedTasks(tasks, index + 1);
    } else {
        return countCompletedTasks(tasks, index + 1);
    }
}

// Function with Math object issues
function calculateAveragePriority() {
    var total = 0;
    // Missing: check for empty array
    for (var i = 0; i < taskList.length; i++) {
        total = total + taskList[i].priority;
    }
    // Should use Math.round or toFixed
    return total / taskList.length;
}

// Filter function with errors
function getHighPriorityTasks(minPriority) {
    var highPriority = [];
    // Should use array methods (filter)
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].priority > minPriority) {
            highPriority.push(taskList[i]);
        }
    }
    return highPriority;
}

// Object with missing methods
var TaskManager = {
    tasks: taskList,
    
    // Missing: method to add task using functional approach
    // Missing: method using array methods (map, filter, reduce)
    
    getTotalTasks: function() {
        return this.tasks.length;
    }
};

// Export issues - should be a module
// Missing: proper module exports
