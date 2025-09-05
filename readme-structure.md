Cinematic Store — Project Structure

Purpose

- Single-page frontend app (vanilla HTML/CSS/JS) that demonstrates product listing, cart, orders, and a lightweight admin UI using localStorage.

Top-level layout (inside `js/` folder)

- index.html — main SPA markup, pages (register, login, home, product, cart, orders, admin, setup)
- style.css — app styles
- manifest.json — PWA metadata (icons)
- media/ — product images and icons
- src/ — all runtime JavaScript (recommended place for code)

`src/` folder (authoritative runtime files)

- `helpers.js`

  - DOM helpers, storage helpers, validation utilities, base64 helpers.
  - Exposes: `getUsers`, `saveUsers`, `getActiveUser`, `setActiveUser`, `updateUser`, `$id`, `showPage`, `isValidEmail`, `isValidPassword`, `togglePassword`, `arrayBufferToBase64`, `base64ToArrayBuffer`, `constantTimeCompare`.

- `auth.js`

  - Client-side auth helpers with Web Crypto PBKDF2 password hashing.
  - Exposes: `hashPassword`, `verifyPassword`, `registerUser`, `loginUser`, `logout`, `clearInputs`.

- `products.js`

  - Product store, seeding, filtering, and detail view.
  - Exposes: `ensureProductsInitialized`, `loadProducts`, `populateCategories`, `viewProduct`, `getNextProductId`.

- `cart.js`

  - Cart operations.
  - Exposes: `addToCart`, `renderCart`, `removeItem`, `continueShopping`.

- `orders.js`

  - Checkout and user order rendering.
  - Exposes: `checkout`, `renderOrders`.

- `admin.js`

  - Admin UI & product CRUD, attach file input handler for image uploads.
  - Exposes: `attachAdminHandlers`, `ensureAdminUser`, `showAdmin`, `adminSaveProduct`, `adminEditProduct`, `adminDeleteProduct`, `renderAdminProducts`, `renderAdminOrders`, `adminConfirmOrder`.

- `main.js`
  - Application entry / initialization (calls `ensureAdminUser`, `ensureProductsInitialized`, wires UI on load).
  - Exposes: `initializeApp` (setup flow), and `initApp` is called on window load.









