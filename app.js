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


export function addTask(title, description = '', priority = 3) {
  try {
    const newTask = new Task(title, description, priority);
    taskList.push(newTask);
    return newTask;
  } catch (error) {
    throw new Error(`Could not add task: ${error.message}`);
  }
}


export function displayAllTasks(tasks = taskList) {
  assertArray(tasks, 'Tasks');
  const titles = [];

  for (const [index, task] of tasks.entries()) {
    titles.push(task.title);
    console.log(`${index + 1}. ${task.id}: ${task.title}`);
  }

  return titles;
}


export function findTaskByTitle(title, tasks = taskList) {
  if (typeof title !== 'string') {
    throw new TypeError('Title search value must be a string.');
  }

  assertArray(tasks, 'Tasks');

    if (title.trim().length === 0) {
    return undefined;
  }

  const searchTitle = formatTaskName(title).toLowerCase();
  return tasks.find(({ title: taskTitle }) => taskTitle.toLowerCase() === searchTitle);
}


export function updateTaskPriority(taskId, newPriority, tasks = taskList) {
  if (typeof taskId !== 'string' && typeof taskId !== 'number') {
    throw new TypeError('Task id must be a string or number.');
  }

  assertArray(tasks, 'Tasks');
  const task = tasks.find(({ id }) => id === taskId);

  if (!task) {
    return false;
  }

  task.priority = normalizePriority(newPriority);
  return true;
}

export function getTaskDetails(task) {
  if (typeof task !== 'object' || task === null) {
    throw new TypeError('Task details require a task object.');
  }

  const { title, description, priority, completed } = task;
  return { title, description, priority, completed };
}

export function mergeTasks(list1 = [], list2 = [], ...otherLists) {
  for (const list of [list1, list2, ...otherLists]) {
    assertArray(list, 'Task list');
  }

  return [...list1, ...list2, ...otherLists.flat()];
}

export function countCompletedTasks(tasks = [], index = 0) {
  if (!Array.isArray(tasks) || index >= tasks.length) {
    return 0;
  }

  const currentCompleted = tasks[index]?.completed === true ? 1 : 0;
  return currentCompleted + countCompletedTasks(tasks, index + 1);
}

export function calculateAveragePriority(tasks = taskList) {
  assertArray(tasks, 'Tasks');

  if (tasks.length === 0) {
    return 0;
  }

  const totalPriority = tasks.reduce((total, { priority }) => total + normalizePriority(priority), 0);
  return Number((totalPriority / tasks.length).toFixed(2));
}

export function getHighPriorityTasks(minPriority = 3, tasks = taskList) {
  assertArray(tasks, 'Tasks');
  const minimum = normalizePriority(minPriority);
  return tasks.filter((task) => normalizePriority(task.priority) > minimum);
}

export function getTaskTitles(tasks = taskList) {
  assertArray(tasks, 'Tasks');
  return tasks.map(({ title }) => title);
}

export function hasCompletedTask(tasks = taskList) {
  assertArray(tasks, 'Tasks');
  return tasks.some(({ completed }) => completed === true);
}

export function allTasksHaveTitles(tasks = taskList) {
  assertArray(tasks, 'Tasks');
  return tasks.every(({ title }) => typeof title === 'string' && title.trim().length > 0);
}


export function filterTasksBy(tasks, predicate) {
  assertArray(tasks, 'Tasks');

  if (typeof predicate !== 'function') {
    throw new TypeError('Predicate must be a function.');
  }

  return tasks.filter(predicate);
}

export function sortTasksByPriority(tasks = taskList) {
  assertArray(tasks, 'Tasks');
  return [...tasks].sort((firstTask, secondTask) => secondTask.priority - firstTask.priority);
}