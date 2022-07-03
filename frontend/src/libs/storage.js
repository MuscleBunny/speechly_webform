// Works as simple wrapper around session storage
export function setItem(key, value) {
  return sessionStorage.setItem(key, value);
}

export function getItem(key) {
  return sessionStorage.getItem(key);
}

export function removeItem(key) {
  return sessionStorage.removeItem(key);
}

export default {
  set: setItem,
  get: getItem,
  remove: removeItem
};
