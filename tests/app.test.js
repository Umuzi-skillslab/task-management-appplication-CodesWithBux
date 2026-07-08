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

describe('Task functions and array operations', () => {
  test('adds tasks to the shared task list', () => {
    const task = addTask('new task', 'Test', 2);
    expect(taskList).toHaveLength(1);
    expect(task.title).toBe('New task');
  });

  test('finds a task by title using strict matching after formatting', () => {
    addTask('Report', 'Finish report', 3);
    expect(findTaskByTitle('report').description).toBe('Finish report');
  });

  test('updates priority by id', () => {
    const task = addTask('Priority task', '', 1);
    expect(updateTaskPriority(task.id, 5)).toBe(true);
    expect(task.priority).toBe(5);
  });

  test('calculates average priority and returns zero for empty arrays', () => {
    expect(calculateAveragePriority()).toBe(0);
    addTask('One', '', 1);
    addTask('Two', '', 5);
    expect(calculateAveragePriority()).toBe(3);
  });

  test('filters high priority tasks', () => {
    addTask('Low', '', 1);
    addTask('High', '', 5);
    expect(getHighPriorityTasks(3).map(({ title }) => title)).toEqual(['High']);
  });

  test('merges multiple task arrays with spread and rest', () => {
    const first = [new Task('A', '', 1, 'a')];
    const second = [new Task('B', '', 2, 'b')];
    const third = [new Task('C', '', 3, 'c')];
    expect(mergeTasks(first, second, third)).toHaveLength(3);
  });

  test('counts completed tasks recursively', () => {
    const tasks = [new Task('A', '', 1, 'a'), new Task('B', '', 2, 'b')];
    tasks[1].toggleCompletion(true);
    expect(countCompletedTasks(tasks)).toBe(1);
  });

  test('uses map, some, every and object spread helpers', () => {
    addTask('Alpha', '', 2);
    addTask('Beta', '', 4).toggleCompletion(true);
    expect(getTaskTitles()).toEqual(['Alpha', 'Beta']);
    expect(hasCompletedTask()).toBe(true);
    expect(allTasksHaveTitles()).toBe(true);
    expect(cloneTaskList()[0]).not.toBe(taskList[0]);
  });

  test('demonstrates higher-order filtering', () => {
    addTask('Low', '', 1);
    addTask('High', '', 5);
    const result = filterTasksBy(taskList, ({ priority }) => priority === 5);
    expect(result).toHaveLength(1);
  });

  test('sorts tasks by priority without mutating original order', () => {
    addTask('Low', '', 1);
    addTask('High', '', 5);
    expect(sortTasksByPriority()[0].title).toBe('High');
    expect(taskList[0].title).toBe('Low');
  });

  test('creates multiple tasks with a rest parameter', () => {
    expect(createTasksFromTitles('one', 'two', 'three')).toHaveLength(3);
  });
});


describe('TaskManager object', () => {
  test('adds, toggles and removes tasks through object methods', () => {
    const task = TaskManager.add('Managed', '', 3);
    expect(TaskManager.getTotalTasks()).toBe(1);
    expect(TaskManager.toggleTask(task.id)).toBe(true);
    expect(TaskManager.getCompletedTasks()).toHaveLength(1);
    expect(TaskManager.removeTask(task.id)).toBe(true);
  });

  test('replaces stored plain objects with Task instances', () => {
    TaskManager.replaceAll([{ id: 'x', title: 'Stored', priority: 4, completed: true }]);
    expect(taskList[0]).toBeInstanceOf(Task);
    expect(TaskManager.getAveragePriority()).toBe(4);
  });
});


describe('Utilities, JSON, storage and edge cases', () => {
  test('formats task names', () => {
    expect(formatTaskName('  clean   room  ')).toBe('Clean room');
  });

  test('serializes and parses JSON data', () => {
    const json = toTaskJSON([{ title: 'Saved' }]);
    expect(fromTaskJSON(json)).toEqual([{ title: 'Saved' }]);
  });

  test('saves and loads tasks from localStorage-compatible storage', () => {
    const storage = createMemoryStorage();
    const task = new Task('Storage', '', 4, 's1');
    expect(saveTasksToStorage([task.toObject()], storage)).toBe(true);
    expect(storage.getItem(STORAGE_KEY)).toContain('Storage');
    expect(loadTasksFromStorage(storage)).toHaveLength(1);
    expect(clearTasksFromStorage(storage)).toBe(true);
  });

  test('handles invalid JSON safely in storage loading', () => {
    const storage = createMemoryStorage();
    storage.setItem(STORAGE_KEY, '{broken json');
    expect(loadTasksFromStorage(storage)).toEqual([]);
  });

  test('rejects invalid task titles', () => {
    expect(() => new Task('', '', 3)).toThrow('Task name cannot be empty');
  });

  test('rejects invalid priority values', () => {
    expect(() => new Task('Invalid', '', 9)).toThrow('Priority must be');
  });

  test('returns false for non-object high priority checks', () => {
    expect(isHighPriority(null)).toBe(false);
  });

  test('extracts task details using object destructuring', () => {
    const task = new Task('Details', 'Read', 2, 'd1');
    expect(getTaskDetails(task)).toEqual({
      title: 'Details',
      description: 'Read',
      priority: 2,
      completed: false
    });
  });
});