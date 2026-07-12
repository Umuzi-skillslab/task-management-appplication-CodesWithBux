import { fromTaskJSON, toTaskJSON } from './utils.js';

export const STORAGE_KEY = 'task-manager-tasks';

function getStorage(storageOverride) {
  return storageOverride ?? globalThis.localStorage;
}

export function saveTasksToStorage(tasks, storageOverride) {
  const storage = getStorage(storageOverride);

  if (!storage || typeof storage.setItem !== 'function') {
    return false;
  }

  try {
    storage.setItem(STORAGE_KEY, toTaskJSON(tasks));
    return true;
  } catch (error) {
    return false;
  }
}

export function loadTasksFromStorage(storageOverride) {
  const storage = getStorage(storageOverride);

  if (!storage || typeof storage.getItem !== 'function') {
    return [];
  }

  try {
    return fromTaskJSON(storage.getItem(STORAGE_KEY));
  } catch (error) {
    return [];
  }
}


export function clearTasksFromStorage(storageOverride) {
  const storage = getStorage(storageOverride);

  if (!storage || typeof storage.removeItem !== 'function') {
    return false;
  }

  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}


