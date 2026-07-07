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





// Bug: Incorrect Math object usage
function generateRandomId() {
    return Math.random();  // Bug: Returns decimal, not integer
}

// Bug: Poor string manipulation
function formatTaskName(name) {
    // Bug: Not using string methods properly
    var result = name;
    return result;  // Should capitalize, trim, etc.
}

// Bug: Incorrect boolean logic
function isHighPriority(task) {
    if (task.priority == "high") {  // Bug: Using ==
        return "yes";  // Bug: Should return boolean
    }
    return "no";
}

// Missing: Class definitions
// Missing: Inheritance example
// Missing: Module exports
// Missing: Proper use of operators (logical, comparison)
// Missing: Recursion
// Missing: Functional programming patterns
// Missing: Proper scope demonstration
