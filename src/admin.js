// Admin: product CRUD, order confirmation, admin UI helpers
function attachAdminHandlers() {
  const imgFileEl = $id("adminProdImgFile");
  if (imgFileEl) {
    imgFileEl.addEventListener("change", function (e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        const dataUrl = ev.target.result;
        const hid = $id("adminProdImg");
        if (hid) hid.value = dataUrl;
        const preview = $id("adminImgPreview");
        if (preview) {
          preview.src = dataUrl;
          preview.style.display = "block";
        }
      };
      reader.readAsDataURL(f);
    });
  }
}

function updateNavForUser() {
  const link = $id("adminNavLink");
  const user = getActiveUser();
  if (!link) return;
  if (isAdmin(user)) link.style.display = "inline-block";
  else link.style.display = "none";
  document.querySelectorAll(".user-nav").forEach((el) => {
    if (isAdmin(user)) el.style.display = "none";
    else el.style.display = "";
  });
}

function updateAdminBadge() {
  const badge = $id("adminBadge");
  const user = getActiveUser();
  if (!badge) return;
  badge.style.display = isAdmin(user) ? "inline-block" : "none";
}

async function ensureAdminUser() {
  let users = getUsers();
  if (!users.some((u) => u.isAdmin)) {
    const plain = "Admin123!";
    const hashed = await hashPassword(plain);
    const admin = {
      name: "Admin",
      email: "admin@admin.com",
      pass: hashed,
      orders: [],
      cart: [],
      isAdmin: true,
    };
    users.push(admin);
    saveUsers(users);
  }
}

function isAdmin(user) {
  return user && user.isAdmin;
}

function showAdmin() {
  const user = getActiveUser();
  if (!isAdmin(user)) {
    alert("Access denied: admin only");
    return;
  }
  showPage("admin");
  renderAdminProducts();
  renderAdminOrders();
}

function adminSaveProduct() {
  const id = Number($id("adminProdId").value) || null;
  const name = $id("adminProdName").value.trim();
  const price = Number($id("adminProdPrice").value) || 0;
  const qty = Number($id("adminProdQty").value) || 0;
  const img = ($id("adminProdImg").value || "").trim() || "media/images.jpg";
  const category =
    ($id("adminProdCategory").value || "").trim() || "Uncategorized";
  const err = $id("adminProdError");
  if (err) err.textContent = "";
  if (!name) {
    if (err) err.textContent = "Product name required";
    else alert("Product name required");
    return;
  }
  if (id) {
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) products[idx] = { id, name, price, qty, img, category };
  } else {
    const newId = getNextProductId();
    products.push({ id: newId, name, price, qty, img, category });
  }
  saveStoredProducts(products);
  populateCategories();
  loadProducts(
    $id("searchInput").value || "",
    Number($id("minPrice").value) || 0,
    Number($id("maxPrice").value) || Infinity,
    $id("categoryFilter") ? $id("categoryFilter").value : ""
  );
  renderAdminProducts();
  $id("adminProdForm").reset();
  $id("adminProdId").value = "";
  updateNavForUser();
  updateAdminBadge();
  const success = $id("adminProdSuccess");
  if (success) {
    success.textContent = "Product saved successfully.";
    success.style.display = "block";
    setTimeout(() => {
      success.style.display = "none";
      success.textContent = "";
    }, 2500);
  }
}

function renderAdminProducts() {
  const list = $id("adminProductList");
  if (!list) return;
  list.innerHTML = "";
  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `\n      <img src="${p.img}" alt="${p.name}">\n      <b>${p.name}</b><br>\n      $${p.price} <small style="color:#666">(${p.category})</small><br>\n      <button onclick="adminEditProduct(${p.id})">Edit</button>\n      <button onclick="adminDeleteProduct(${p.id})">Delete</button>\n    `;
    list.appendChild(div);
  });
}

function adminEditProduct(id) {
  try {
    const p = products.find((x) => x.id === id);
    if (!p) {
      const errEl = $id("adminProdError");
      if (errEl) errEl.textContent = "Product not found";
      return;
    }
    showPage("admin");
    const idEl = $id("adminProdId");
    const nameEl = $id("adminProdName");
    const priceEl = $id("adminProdPrice");
    const qtyEl = $id("adminProdQty");
    const imgHidden = $id("adminProdImg");
    const catEl = $id("adminProdCategory");
    if (idEl) idEl.value = p.id;
    if (nameEl) nameEl.value = p.name;
    if (priceEl) priceEl.value = p.price;
    if (qtyEl) qtyEl.value = p.qty;
    if (imgHidden) imgHidden.value = p.img;
    const preview = $id("adminImgPreview");
    if (preview) {
      preview.src = p.img;
      preview.style.display = p.img ? "block" : "none";
    }
    if (catEl) catEl.value = p.category || "";
    if (nameEl) nameEl.focus();
    const errEl = $id("adminProdError");
    if (errEl) errEl.textContent = "";
  } catch (e) {
    console.error("adminEditProduct error", e);
    const errEl = $id("adminProdError");
    if (errEl) errEl.textContent = "Failed to populate product for editing.";
  }
}

function adminDeleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  products = products.filter((p) => p.id !== id);
  saveStoredProducts(products);
  populateCategories();
  loadProducts();
  renderAdminProducts();
}

function getAllUserOrders() {
  const users = getUsers();
  let all = [];
  users.forEach((u) => {
    if (u.orders && u.orders.length)
      u.orders.forEach((o) =>
        all.push({ userEmail: u.email, userName: u.name, order: o })
      );
  });
  return all;
}

function renderAdminOrders() {
  const container = $id("adminOrderList");
  if (!container) return;
  const all = getAllUserOrders();
  container.innerHTML = "<h3>All Orders</h3>";
  if (all.length === 0) {
    container.innerHTML += "<p>No orders</p>";
    return;
  }
  all.forEach((item) => {
    const o = item.order;
    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `\n      <h4>Order #${o.id} - ${item.userName} (${
      item.userEmail
    })</h4>\n      <p>Total: $${o.total}</p>\n      <p>Items: ${o.items
      .map((i) => i.name)
      .join(", ")}</p>\n      <button onclick="adminConfirmOrder('${
      item.userEmail
    }', ${o.id})">Confirm (received money)</button>\n    `;
    container.appendChild(div);
  });
}

function adminConfirmOrder(userEmail, orderId) {
  if (!confirm("Confirm receipt of payment and remove this order from user?"))
    return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === userEmail);
  if (idx === -1) {
    alert("User not found");
    return;
  }
  const user = users[idx];
  user.orders = (user.orders || []).filter((o) => o.id !== orderId);
  users[idx] = user;
  saveUsers(users);
  renderAdminOrders();
  if (getActiveUser() && getActiveUser().email === userEmail) renderOrders();
}
