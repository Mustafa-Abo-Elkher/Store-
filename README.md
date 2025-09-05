Cinematic Store - Frontend Structure

This project is a small local-only SPA (HTML/CSS/JS) that manages products, cart, orders, and a simple admin UI using localStorage.

Files (split for clarity)

- helpers.js

  - DOM + storage helpers and validation utilities
  - getUsers / saveUsers / getActiveUser / setActiveUser / updateUser
  - $id(id), showPage(id), isValidEmail, isValidPassword, togglePassword
  - base64 helpers and constantTimeCompare used by auth

- auth.js

  - Password hashing (Web Crypto PBKDF2): hashPassword, verifyPassword
  - registerUser(), loginUser(), logout(), clearInputs()
  - Uses helpers for DOM and storage operations

- products.js

  - Product persistence and listing
  - getStoredProducts(), saveStoredProducts(), defaultProducts
  - ensureProductsInitialized(), getNextProductId()
  - loadProducts(filterText,min,max,category), populateCategories(), viewProduct(id)

- cart.js

  - addToCart(), renderCart(), removeItem(index), continueShopping()

- orders.js

  - checkout(), renderOrders()

- admin.js

  - Admin UI helpers and handlers
  - attachAdminHandlers() (file input -> data URL)
  - updateNavForUser(), updateAdminBadge()
  - ensureAdminUser() (seeds a default admin if none exists)
  - isAdmin(), showAdmin(), adminSaveProduct(), renderAdminProducts(), adminEditProduct(), adminDeleteProduct()
  - getAllUserOrders(), renderAdminOrders(), adminConfirmOrder(userEmail,orderId)

- main.js
  - App entry point: controls initial page selection and wires attachAdminHandlers()
  - hasAdminUser(), initializeApp() (setup flow when needed)

How it runs

- index.html includes the scripts in this order: helpers.js, auth.js, products.js, cart.js, orders.js, admin.js, main.js
- `main.js` runs on load and preserves the previous behavior: it will auto-seed a default admin and the product catalog if missing, then show login or home depending on active session.

Notes and roadmap

- The split keeps all original runtime behavior unchanged, but organizes code into files by concern.
- Next steps that improve developer ergonomics and safety:
  1. Convert this to an ES module structure (import/export) and use a small bundler (Vite/Rollup) for cleaner imports and smaller production bundle.
  2. Add unit tests for critical flows: auth hashing/verify, product CRUD, cart/checkout.
  3. Move sensitive state (users, orders) to a backend service for real multi-user security.
  4. Improve UI accessibility and responsive design.

If you'd like I can:

- Replace all `document.getElementById` usage with `$id()` in all files (done in most places already).
- Convert to modules (ESM) and update `index.html` accordingly.
- Scaffold a tiny Node/Express backend to demonstrate secure user storage and APIs.
