export const PRIORITY_LABELS = Object.freeze(['low', 'medium', 'high']);
export const PRIORITY_VALUES = Object.freeze({ low: 1, medium: 3, high: 5 });

export function assertString(value, fieldName) {
  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} must be a string.`);
  }
}

export function assertArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be an array.`);
  }
}

export function formatTaskName(name) {
  assertString(name, 'Task name');
  const cleanedName = name.trim().replace(/\s+/g, ' ');

  if (cleanedName.length === 0) {
    throw new Error('Task name cannot be empty.');
  }

  return `${cleanedName.charAt(0).toUpperCase()}${cleanedName.slice(1)}`;
}

export function isValidPriority(priority) {
  if (typeof priority === 'number') {
    return Number.isInteger(priority) && priority >= 1 && priority <= 5;
  }

  if (typeof priority === 'string') {
    const numericPriority = Number(priority);
    return PRIORITY_LABELS.includes(priority.toLowerCase()) ||
      (Number.isInteger(numericPriority) && numericPriority >= 1 && numericPriority <= 5);
  }

  return false;
}

export function normalizePriority(priority) {
  if (!isValidPriority(priority)) {
    throw new RangeError('Priority must be low, medium, high, or an integer from 1 to 5.');
  }

  if (typeof priority === 'number') {
    return priority;
  }

  const lowerPriority = priority.toLowerCase();
  return PRIORITY_VALUES[lowerPriority] ?? Number(priority);
}

export function generateRandomId(prefix = 'task') {
  assertString(prefix, 'ID prefix');
  const safePrefix = prefix.trim() || 'task';
  const randomNumber = Math.floor(Math.random() * 1_000_000);
  return `${safePrefix}-${Date.now()}-${randomNumber}`;
}

export function isHighPriority(task) {
  if (typeof task !== 'object' || task === null) {
    return false;
  }

  try {
    return normalizePriority(task.priority) >= 4;
  } catch (error) {
    return false;
  }
}

export function toTaskJSON(data) {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new Error(`Could not convert tasks to JSON: ${error.message}`);
  }
}  
