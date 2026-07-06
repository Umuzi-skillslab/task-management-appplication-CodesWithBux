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


export function setupEventListeners(documentRef = document) {
  const { form, taskListContainer, filterSelect, clearCompletedButton } = selectElements(documentRef);
  let listenerCount = 0;

  // 1. Submitting the form adds a task (and auto-saves).
  if (form) {
    form.addEventListener('submit', handleAddTask);
    listenerCount += 1;
  }

  // 2. One delegated listener handles every task's buttons.
  if (taskListContainer) {
    taskListContainer.addEventListener('click', handleTaskClick);
    listenerCount += 1;
  }

  // 3. Changing the filter re-renders the visible list.
  if (filterSelect) {
    filterSelect.addEventListener('change', handleFilterChange);
    listenerCount += 1;
  }

  // 4. Clear-completed removes all finished tasks at once.
  if (clearCompletedButton) {
    clearCompletedButton.addEventListener('click', handleClearCompleted);
    listenerCount += 1;
  }

  // 5. Safety net: store the latest state before the page unloads.
  window.addEventListener('beforeunload', saveState);
  listenerCount += 1;

  loadStoredTasks();
  return listenerCount;
}


// Add a new task from the form, then clear the inputs. Adding auto-saves.
export function handleAddTask(event) {
  event?.preventDefault?.();
  const { titleInput, descriptionInput, priorityInput } = selectElements();

  if (!titleInput || !descriptionInput || !priorityInput) {
    return false;
  }

  try {
    addTask(titleInput.value, descriptionInput.value, priorityInput.value);
    saveState();
    titleInput.value = '';
    descriptionInput.value = '';
    priorityInput.value = '3';
    titleInput.focus();
    displayTasks();
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
}

// Return the tasks matching the current filter.
function getVisibleTasks() {
  if (currentFilter === 'completed') {
    return taskList.filter((task) => task.completed);
  }
  if (currentFilter === 'pending') {
    return taskList.filter((task) => !task.completed);
  }
  return taskList;
}

// Render the task list.
export function displayTasks(container = document.querySelector('#task-list')) {
  if (!container) {
    return false;
  }

  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    const label = currentFilter === 'all' ? '' : `${currentFilter} `;
    container.innerHTML = `<p class="empty-state">No ${label}tasks yet &mdash; add your first one above!</p>`;
    updateStatistics();
    return true;
  }

  container.innerHTML = visibleTasks
    .map(({ id, title, description, priority, completed }) => {
      const badge = priorityLabel(priority);
      return `
      <article class="task ${completed ? 'task--completed' : ''}" data-task-id="${escapeHTML(id)}" data-priority="${escapeHTML(priority)}">
        <div class="task-body">
          <div class="task-top">
            <h3>${escapeHTML(title)}</h3>
            <span class="pill pill-${badge.cls}">${badge.text}</span>
          </div>
          <p class="task-desc">${escapeHTML(description || 'No description')}</p>
        </div>
        <div class="task-actions">
          <button type="button" class="btn-toggle" data-action="toggle">${completed ? 'Undo' : 'Done'}</button>
          <button type="button" class="btn-delete" data-action="delete">Delete</button>
        </div>
      </article>`;
    })
    .join('');

  updateStatistics();
  return true;
}

export function updateStatistics(row = document.querySelector('#stat-row')) {
  if (!row) {
    return false;
  }

  const totalTasks = taskList.length;
  const completedTasks = countCompletedTasks(taskList);
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  row.innerHTML = `
    <div class="stat-item stat-done">
      <span class="stat-num">${completedTasks}</span>
      <span class="stat-label">Done</span>
    </div>
    <div class="stat-item stat-pending">
      <span class="stat-num">${pendingTasks}</span>
      <span class="stat-label">Pending</span>
    </div>
    <div class="stat-item stat-rate">
      <span class="stat-num">${completionRate}<small>%</small></span>
      <span class="stat-label">Completion rate</span>
    </div>
  `;

  const savedCount = document.querySelector('#saved-count');
  if (savedCount) {
    savedCount.textContent = totalTasks === 1 ? '1 task saved' : `${totalTasks} tasks saved`;
  }

  return true;
}


export function handleTaskClick(event) {
  const actionButton = event.target.closest('[data-action]');
  const taskElement = event.target.closest('[data-task-id]');

  if (!actionButton || !taskElement) {
    return false;
  }

  const { action } = actionButton.dataset;
  const { taskId } = taskElement.dataset;

  if (action === 'toggle') {
    TaskManager.toggleTask(taskId);
  }

  if (action === 'delete') {
    TaskManager.removeTask(taskId);
  }

  saveState();
  displayTasks();
  return true;
}

// Update the visible filter and re-render.
export function handleFilterChange(event) {
  currentFilter = event.target.value;
  displayTasks();
}

// Load saved tasks on startup. Loading must never break initialisation.
export function loadStoredTasks() {
  try {
    const storedTasks = loadTasksFromStorage();
    if (storedTasks.length > 0) {
      TaskManager.replaceAll(storedTasks);
    }
    displayTasks();
    return storedTasks.length;
  } catch (error) {
    console.error(`Could not load saved tasks: ${error.message}`);
    displayTasks();
    return 0;
  }
}

// Remove every completed task, then save and re-render.
export function handleClearCompleted() {
  for (const completedTask of TaskManager.getCompletedTasks()) {
    TaskManager.removeTask(completedTask.id);
  }

  saveState();
  displayTasks();
  return taskList.length;
}

// Initialise after the DOM is ready (fixes the starter's premature top-level call).
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => setupEventListeners(document));
}


