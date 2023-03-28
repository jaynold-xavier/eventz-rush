export function getLocalStorageItem(key) {
  const item = window.localStorage.getItem(key);

  if (!item || item === "null") {
    return null;
  }

  try {
    return JSON.parse(item);
  } catch (e) {
    console.log(e);
  }

  return null;
}

export function setLocalStorageItem(key, value) {
  if (value === undefined) {
    value = null;
  } else {
    value = JSON.stringify(value);
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }

  return false;
}

export function removeLocalStorageItem(key) {
  window.localStorage.removeItem(key);
}
