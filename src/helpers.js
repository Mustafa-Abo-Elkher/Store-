// Helpers (DOM, storage helpers, validation, encoding)
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getActiveUser() {
  // Check session storage first (admin)
  const sessionUser = JSON.parse(
    sessionStorage.getItem("activeUser") || "null"
  );
  if (sessionUser) return sessionUser;

  // Then local storage (regular users)
  return JSON.parse(localStorage.getItem("activeUser") || "null");
}

function setActiveUser(user) {
  clearActiveUser(); // Remove any previous session

  if (user && user.isAdmin) {
    sessionStorage.setItem("activeUser", JSON.stringify(user));
  } else {
    localStorage.setItem("activeUser", JSON.stringify(user));
  }
}

function clearActiveUser() {
  sessionStorage.removeItem("activeUser");
  localStorage.removeItem("activeUser");
}

// When updating user, preserve same storage context
function updateUser(updatedUser) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === updatedUser.email);
  if (idx >= 0) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
  setActiveUser(updatedUser);
}

function $id(id) {
  return document.getElementById(id);
}

function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(pass);
}

function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function constantTimeCompare(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}
