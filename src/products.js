// Products: storage, seeding, filtering, view
function getStoredProducts() {
  return JSON.parse(localStorage.getItem("products")) || null;
}

function saveStoredProducts(list) {
  localStorage.setItem("products", JSON.stringify(list));
}

const defaultProducts = [
  { id: 1, name: "Book", price: 200, qty: 5, img: "media/9780300266245.avif" },
  {
    id: 2,
    name: "Pen",
    price: 100,
    qty: 10,
    img: "media/a-game-of-thrones.jpg",
  },
  { id: 3, name: "Phone", price: 500, qty: 3, img: "media/palestine.jpg" },
  {
    id: 4,
    name: "Makeup",
    price: 250,
    qty: 8,
    img: "media/widow_of_the_south_350.jpg",
  },
];

let products = [];

function ensureProductsInitialized() {
  let stored = getStoredProducts();
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    products = defaultProducts.slice();
    saveStoredProducts(products);
  } else {
    products = stored;
  }
}

function getNextProductId() {
  return products.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
}

let currentProduct = null;

function loadProducts(
  filterText = "",
  minPrice = 0,
  maxPrice = Infinity,
  category = ""
) {
  const list = $id("productList");
  if (!list) return;
  list.innerHTML = "";
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) &&
      p.price >= minPrice &&
      p.price <= maxPrice &&
      (category === "" || p.category === category)
  );
  if (filtered.length === 0) {
    list.innerHTML = "<p>No products found</p>";
    return;
  }
  filtered.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `\n      <img src="${p.img}" alt="${p.name}">\n      <b>${p.name}</b><br>\n  $${p.price} <small style="color:#666">(${p.category})</small><br>\n      <button onclick="viewProduct(${p.id})">View</button>\n    `;
    list.appendChild(div);
  });
}

function populateCategories() {
  const sel = $id("categoryFilter");
  if (!sel) return;
  const cats = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );
  sel.innerHTML =
    '<option value="">All Categories</option>' +
    cats.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function viewProduct(id) {
  currentProduct = products.find((p) => p.id === id);
  if (!currentProduct) return;
  const nameEl = $id("prodName");
  const imgEl = $id("prodImg");
  const priceEl = $id("prodPrice");
  const qtyEl = $id("prodQty");
  const catEl = $id("prodCategory");
  if (nameEl) nameEl.textContent = currentProduct.name;
  if (imgEl) imgEl.src = currentProduct.img;
  if (priceEl) priceEl.textContent = "Price: $" + currentProduct.price;
  if (qtyEl) qtyEl.textContent = "Available: " + currentProduct.qty;
  if (catEl)
    catEl.textContent =
      "Category: " + (currentProduct.category || "Uncategorized");
  const addBtn = $id("addToCartBtn");
  if (addBtn) {
    const user = getActiveUser();
    addBtn.style.display = isAdmin(user) ? "none" : "inline-block";
  }
  showPage("product");
}
