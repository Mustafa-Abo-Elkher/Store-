// Main entry: initialize app UI and wire handlers
function hasAdminUser() {
  const users = getUsers();
  return Array.isArray(users) && users.some((u) => u.isAdmin);
}

async function initApp() {
  // Single, predictable startup path — keep errors local and continue where possible
  try {
    await ensureAdminUser();
    await ensureProductsInitialized();
  } catch (e) {
    console.error("Startup initialization failed:", e);
  }

  const activeUser = getActiveUser();

  // Wire common UI pieces regardless of auth state
  updateNavForUser();
  updateAdminBadge();
  attachAdminHandlers();
  populateCategories();

  if (activeUser) {
    if (isAdmin(activeUser)) {
      showAdmin();
      // Admin may still need to see products / orders; render cart/orders if desired
      renderCart();
      renderOrders();
    } else {
      showPage("home");
      loadProducts();
      renderCart();
      renderOrders();
    }
  } else {
    // no active user
    if (!hasAdminUser()) showPage("setup");
    else showPage("login");
  }
}

// attach single load handler
// Deprecated: original runtime moved to js/src/main.js
console.warn("Deprecated file loaded: js/main.js. Use js/src/main.js instead.");

async function initializeApp() {
  const name = ($id("setupName").value || "Admin").trim();
  const email = ($id("setupEmail").value || "").trim();
  const pass = ($id("setupPass").value || "").trim();
  const confirm = ($id("setupConfirm").value || "").trim();
  const err = $id("setupError");
  const success = $id("setupSuccess");
  if (err) err.textContent = "";
  if (!email || !pass || !confirm) {
    if (err) err.textContent = "Email and password are required";
    return;
  }
  if (!isValidEmail(email)) {
    if (err) err.textContent = "Invalid email";
    return;
  }
  if (!isValidPassword(pass)) {
    if (err)
      err.textContent =
        "Password must include uppercase, lowercase, number & special character and be at least 6 chars";
    return;
  }
  if (pass !== confirm) {
    if (err) err.textContent = "Passwords do not match";
    return;
  }

  let users = getUsers();
  if (users.some((u) => u.email === email)) {
    if (err) err.textContent = "This email is already registered";
    return;
  }
  const hashed = await hashPassword(pass);
  const admin = {
    name: name || "Admin",
    email,
    pass: hashed,
    orders: [],
    cart: [],
    isAdmin: true,
  };
  users.push(admin);
  saveUsers(users);

  // seed products
  await ensureProductsInitialized();

  if (success) {
    success.textContent = "App initialized. You can now login as admin.";
    success.style.display = "block";
  }
  setTimeout(() => {
    showPage("login");
    if (success) {
      success.style.display = "none";
      success.textContent = "";
    }
  }, 1200);
}
