import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export const loadString = (key: string): string | undefined => {
  try {
    return storage.getString(key);
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return undefined;
  }
};

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export const saveString = (key: string, value: string): boolean => {
  try {
    storage.set(key, value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export const load = <T = unknown>(key: string): T | undefined => {
  try {
    const data = storage.getString(key);
    return JSON.parse(data ?? '') as T;
  } catch {
    return undefined;
  }
};

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export const save = (key: string, value: unknown): boolean => {
  try {
    saveString(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export const remove = (key: string): void => {
  try {
    storage.delete(key);
  } catch {}
};

/**
 * Burn it all to the ground.
 */
export const clear = (): void => {
  try {
    storage.clearAll();
  } catch {}
};
