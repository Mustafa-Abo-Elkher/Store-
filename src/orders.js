// Orders: checkout and render user orders
function checkout() {
  let user = getActiveUser();
  if (!user) return;
  if (user.cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  let order = {
    id: Date.now(),
    items: [...user.cart],
    total: user.cart.reduce((t, c) => t + c.price, 0),
  };
  user.orders.push(order);
  user.cart = [];
  updateUser(user);
  renderOrders();
  showPage("orders");
}

function renderOrders() {
  let user = getActiveUser();
  if (!user) return;
  let container = $id("orderList");
  if (!container) return;
  container.innerHTML = `<h3>${user.name}'s Orders</h3>`;
  if (!user.orders || user.orders.length === 0) {
    container.innerHTML += "<p>No orders yet.</p>";
    return;
  }
  user.orders.forEach((o) => {
    let div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `\n      <h4>Order #${o.id}</h4>\n      <p>Total: $${
      o.total
    }</p>\n      <p>Items: ${o.items.map((i) => i.name).join(", ")}</p>\n    `;
    container.appendChild(div);
  });
}
