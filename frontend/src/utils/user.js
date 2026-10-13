import { getItemImageUrl } from "./itemImages";

const USER_UPDATED_EVENT = "foundly:user-updated";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

export function updateStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

export function onStoredUserChange(callback) {
  window.addEventListener(USER_UPDATED_EVENT, callback);
  return () => window.removeEventListener(USER_UPDATED_EVENT, callback);
}

export function getAvatarUrl(user) {
  return user?.profilePicture ? getItemImageUrl(user.profilePicture) : "";
}

export function getInitial(user) {
  return user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
}
