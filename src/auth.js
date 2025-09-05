// Auth: password hashing, register, login, logout
// Password hashing (Web Crypto PBKDF2)

let adminState = true;
async function hashPassword(password, iterations = 100000) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt, iterations: iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const saltB64 = arrayBufferToBase64(salt.buffer);
  const dkB64 = arrayBufferToBase64(derivedBits);
  return `${iterations}$${saltB64}$${dkB64}`;
}

async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return { ok: false };
  if (stored.indexOf("$") === -1) {
    const ok = password === stored;
    return { ok, legacy: ok };
  }
  const [iterationsStr, saltB64, dkB64] = stored.split("$");
  const iterations = Number(iterationsStr) || 100000;
  const salt = base64ToArrayBuffer(saltB64);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const candidateB64 = arrayBufferToBase64(derivedBits);
  const ok = constantTimeCompare(candidateB64, dkB64);
  return { ok };
}

function registerUser() {
  (async function () {
    let name = $id("regName").value.trim();
    let email = $id("regEmail").value.trim();
    let pass = $id("regPass").value.trim();
    let confirm = $id("regConfirm").value.trim();
    let error = $id("regError");

    if (!name || !email || !pass || !confirm) {
      error.textContent = "All fields are required!";
      return;
    }
    if (!isValidEmail(email)) {
      error.textContent = "Please enter a valid email!";
      return;
    }
    if (!isValidPassword(pass)) {
      error.textContent =
        "Password must include uppercase, lowercase, number & special character!";
      return;
    }
    if (pass !== confirm) {
      error.textContent = "Passwords do not match!";
      return;
    }

    let users = getUsers();
    if (users.some((u) => u.email === email)) {
      error.textContent = "This email is already registered!";
      return;
    }

    // hash password before storing
    const hashed = await hashPassword(pass);
    let newUser = {
      name,
      email,
      pass: hashed,
      orders: [],
      cart: [],
      isAdmin: adminState,
    };
    users.push(newUser);
    saveUsers(users);
    adminState = false;
    error.textContent = "";
    showPage("login");
  })();
}

function loginUser() {
  (async function () {
    let email = $id("loginEmail").value.trim();
    let pass = $id("loginPass").value.trim();
    let error = $id("loginError");

    if (!email || !pass) {
      error.textContent = "Please enter email and password!";
      return;
    }

    let users = getUsers();
    let idx = users.findIndex((u) => u.email === email);
    if (idx === -1) {
      error.textContent = "Invalid credentials!";
      return;
    }
    let user = users[idx];

    const res = await verifyPassword(pass, user.pass);
    if (!res.ok) {
      error.textContent = "Invalid credentials!";
      return;
    }

    // if legacy plaintext matched, re-hash and save
    if (res.legacy) {
      user.pass = await hashPassword(pass);
      users[idx] = user;
      saveUsers(users);
    }

    setActiveUser(user);
    renderCart();
    // if admin, show admin panel; otherwise show home
    if (isAdmin(user)) {
      ensureProductsInitialized();
      populateCategories();
      showAdmin();
    } else {
      populateCategories();
      loadProducts();
      showPage("home");
    }
    updateNavForUser();
    updateAdminBadge();
  })();
}

function logout() {
  localStorage.removeItem("activeUser");
  clearInputs();
  document.querySelectorAll(".error").forEach((err) => (err.textContent = ""));
  showPage("login");
  updateNavForUser();
  updateAdminBadge();
}

function clearInputs() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
}
