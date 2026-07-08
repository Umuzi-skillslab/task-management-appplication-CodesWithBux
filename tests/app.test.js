import {
  addTask,
  allTasksHaveTitles,
  calculateAveragePriority,
  cloneTaskList,
  countCompletedTasks,
  createTasksFromTitles,
  filterTasksBy,
  findTaskByTitle,
  getHighPriorityTasks,
  getTaskDetails,
  getTaskTitles,
  hasCompletedTask,
  mergeTasks,
  resetTasks,
  snapshotTaskList,
  sortTasksByPriority,
  SubTask,
  Task,
  TaskManager,
  taskList,
  updateTaskPriority
} from '../src/app.js';
import { clearTasksFromStorage, loadTasksFromStorage, saveTasksToStorage, STORAGE_KEY } from '../src/storage.js';
import { formatTaskName, fromTaskJSON, isHighPriority, toTaskJSON } from '../src/utils.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    setItem(key, value) {
      store.set(key, String(value));
    },
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

beforeEach(() => {
  resetTasks();
});







describe('Task Class', () => {
    test('should create a task', () => {
        var task = new Task('Test Task', 'Description', 3);
        expect(task.title).toBe('Test Task');
        // Missing: other property checks
    });
    
    // Missing: test for getInfo method
    // Missing: test for toggle completion
});

describe('Task Functions', () => {
    // Missing: beforeEach to reset taskList
    
    test('should add task', () => {
        var task = addTask('New Task', 'Test', 2);
        // Wrong assertion - should check taskList
        expect(task).toBeDefined();
    });
    
    // Missing: test for findTaskByTitle
    // Missing: test for updateTaskPriority
    // Missing: test for calculateAveragePriority
    // Missing: test for error handling
});

describe('Array Operations', () => {
    // Missing: tests for mergeTasks
    // Missing: tests for getHighPriorityTasks
    // Missing: tests for recursive function
});

// Missing: describe blocks for:
// - SubTask class and inheritance
// - Destructuring functions
// - Spread/rest operator functions
// - Module exports/imports
