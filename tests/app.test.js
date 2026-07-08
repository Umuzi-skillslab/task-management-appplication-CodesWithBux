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

describe('Task class and inheritance', () => {
  test('creates a task with required properties', () => {
    const task = new Task('test task', 'Description', 3, 't-1');
    expect(task.id).toBe('t-1');
    expect(task.title).toBe('Test task');
    expect(task.completed).toBe(false);
  });

  test('returns formatted task information with template literal content', () => {
    const task = new Task('Write tests', 'Use Jest', 5, 't-2');
    expect(task.getInfo()).toContain('Task: Write tests - Priority: 5');
  });

  test('toggles task completion', () => {
    const task = new Task('Toggle me', '', 2, 't-3');
    expect(task.toggleCompletion()).toBe(true);
    expect(task.toggleCompletion(false)).toBe(false);
  });

  test('SubTask extends Task and stores parent id', () => {
    const parent = new Task('Parent', '', 3, 'parent-1');
    const child = new SubTask('Child', '', 2, parent, 'child-1');
    expect(child).toBeInstanceOf(Task);
    expect(child.parentTaskId).toBe('parent-1');
  });
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
