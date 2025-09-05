// Cart: add items to cart, render cart, remove items
function addToCart() {
  let user = getActiveUser();
  if (!user) return;
  user.cart.push(currentProduct);
  updateUser(user);
  renderCart();
  showPage("cart");
}

function renderCart() {
  let user = getActiveUser();
  if (!user) return;
  let items = $id("cartItems");
  if (!items) return;
  items.innerHTML = "";
  let total = 0;
  user.cart.forEach((c, i) => {
    total += c.price;
    items.innerHTML += `<p>${c.name} <small style="color:#666">(${
      c.category || "N/A"
    })</small> - $${c.price} <button onclick="removeItem(${i})">x</button></p>`;
  });
  const totalEl = $id("cartTotal");
  if (totalEl) totalEl.textContent = "Total: $" + total;
}

function removeItem(i) {
  let user = getActiveUser();
  if (!user) return;
  user.cart.splice(i, 1);
  updateUser(user);
  renderCart();
}

function continueShopping() {
  showPage("home");
  populateCategories();
  loadProducts();
}
