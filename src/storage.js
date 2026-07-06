import { fromTaskJSON, toTaskJSON } from './utils.js';

export const STORAGE_KEY = 'task-manager-tasks';

function getStorage(storageOverride) {
  return storageOverride ?? globalThis.localStorage;
}