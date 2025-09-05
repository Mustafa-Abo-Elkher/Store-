Cinematic Store — Features, Routing & Functionality

Overview
This file lists all user-facing features and the internal JS functions/pages that implement them. Use it as a quick reference when auditing behavior or writing tests.

Pages (in `index.html`)

- `#register` — user registration form
- `#login` — login form
- `#home` — product listing with filters (search, price range, category)
- `#product` — product detail view
- `#cart` — shopping cart
- `#orders` — user orders
- `#admin` — admin panel (product CRUD + orders overview)
- `#setup` — one-time setup flow (create initial admin) — shown only when no admin exists

Routing / UI flow (how pages are shown)

- `showPage(id)` — central helper that toggles `.active` on `.page` sections. All navigation uses this to switch pages.
- On app load (`src/main.js -> initApp()`):
  - `ensureAdminUser()` runs to seed an admin if no admin exists (this preserves previous behavior).
  - `ensureProductsInitialized()` seeds default products if none are stored.
  - If `getActiveUser()` exists, show admin panel (if admin) or `#home` (if regular user).
  - Otherwise, if no admin exists show `#setup`, else show `#login`.

Authentication

- Registration: `registerUser()` (`src/auth.js`)
  - Validates inputs; hashes passwords via `hashPassword()` (PBKDF2); saves user to `localStorage`.
- Login: `loginUser()` (`src/auth.js`)
  - Verifies password with `verifyPassword()`; supports migrating legacy plaintext passwords by re-hashing on successful login.
  - Sets `activeUser` in localStorage via `setActiveUser()` and updates UI.
- Logout: `logout()` clears `activeUser` and returns to `#login`.

Products

- Persistence: `getStoredProducts()` / `saveStoredProducts()` store products in `localStorage` under `products`.
- Seeding: `ensureProductsInitialized()` populates `products` with `defaultProducts` when empty.
- Listing and filters: `loadProducts(filterText, minPrice, maxPrice, category)` renders product cards in `#productList`.
- Category dropdown: `populateCategories()` reads categories from products and fills `#categoryFilter`.
- Product detail: `viewProduct(id)` fills `#product` page elements (name, image, price, qty, category) and hides Add-to-Cart for admins.

Cart & Orders

- Cart: stored on the user object (`user.cart`).
  - `addToCart()` pushes `currentProduct` to `user.cart` and calls `updateUser()` to persist.
  - `renderCart()` shows cart items and total.
  - `removeItem(index)` removes an item and re-renders.
- Checkout: `checkout()` creates an order object `{id, items, total}` and moves cart to `user.orders`, empties cart, saves user.
- Orders page: `renderOrders()` shows the logged-in user’s orders.

Admin features

- Admin identification: a `isAdmin` boolean on the user object.
- Default admin seeding: `ensureAdminUser()` creates a default admin `admin@admin.com` with password `Admin123!` (hashed) if none exists.
- Product CRUD
  - `adminSaveProduct()` (create/update)
  - `renderAdminProducts()` lists admin products with Edit/Delete
  - `adminEditProduct(id)` populates the admin form
  - `adminDeleteProduct(id)` removes product from `products` and updates DOM/storage
- Image upload
  - `attachAdminHandlers()` binds a File input change event to convert the file to a DataURL (base64) and stores it in the hidden `#adminProdImg` input and shows a preview.
- Orders management
  - `getAllUserOrders()` collects orders from all users
  - `renderAdminOrders()` lists all orders with a Confirm button
  - `adminConfirmOrder(userEmail, orderId)` removes the specified order from the user and updates storage/UI

Utilities / Helpers

- `helpers.js` provides small helpers used across features (DOM, storage, encoding, validation).
- `hashPassword()` / `verifyPassword()` use Web Crypto PBKDF2 + SHA-256 for client-side password hashing (note: client-side hashing does not replace server-side secure auth).

Notes & caveats

- This is a local-only demo app. For production, move auth and persistent data to a server-side API and use secure cookie/session management.
- All images uploaded in admin are stored as Data URLs in `localStorage` — fine for small demos, not recommended for production.
- Inline `onclick` attributes are currently used in `index.html` for quick binding. Converting to unobtrusive event listeners is recommended before converting to ES modules.

Testing checklist (manual)

- Register a user and verify stored user appears in `localStorage` (password is hashed).
- Login with that user, add products to cart, checkout, and verify `orders` array is updated.
- Login as admin, add a product with image upload, edit it, delete it, and verify listing updates.
- Confirm an order as admin and ensure it is removed from the user and from admin view.
