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

Development tips

- Keep `src/` as the canonical place for runtime JS. `index.html` references `src/*.js`.
- To prepare for publish, convert JS to ES modules and use a bundler (Vite/Rollup) to produce a production bundle and optionally minify assets.
- Move sensitive logic (auth, orders) to a backend for production-grade security.

Files intentionally kept out of `src/` (for now)

- `README.md` and `README-structure.md` and `README-features.md` — documentation files.

If you want, I can also:

- Convert inline `onclick` handlers to unobtrusive event listeners in `main.js`.
- Convert to ES modules and add a minimal `package.json` + Vite setup.

## Structure Diagram (visual)

Below are two simple visualizations of the project structure and the app startup flow: an ASCII diagram for plain viewers and a Mermaid flowchart (if your platform supports Mermaid rendering).

ASCII folder layout

```
js/
├─ index.html        <- SPA markup (pages, nav)
├─ style.css         <- global styles
├─ manifest.json     <- PWA metadata
├─ media/            <- images & icons
└─ src/              <- all runtime JS (canonical)
   ├─ helpers.js     <- DOM/storage/validation helpers
   ├─ auth.js        <- hashing + auth flows
   ├─ products.js    <- product store, listing, view
   ├─ cart.js        <- cart operations
   ├─ orders.js      <- checkout & orders
   ├─ admin.js       <- admin CRUD + upload handlers
   └─ main.js        <- app entry + initialization
```

Startup / runtime flow (ASCII)

```
[index.html] --loads--> [src/main.js]
      |                     |
      |                     v
      |               initApp() (on load)
      |                     |
      |       -------------------------------
      |       | ensureAdminUser(), ensureProductsInitialized()
      |       -------------------------------
      |                     |
      v                     v
 showPage(login)      if activeUser -> isAdmin? -> showAdmin() : showHome()
```

Mermaid flowchart (paste into a renderer that supports Mermaid):

```mermaid
flowchart TD
  A[index.html] --> B[src/main.js]
  B --> C[initApp()]
  C --> D{admin exists?}
  D -- no --> E[show setup]
  D -- yes --> F{activeUser?}
  F -- no --> G[show login]
  F -- yes --> H{isAdmin?}
  H -- yes --> I[showAdmin()]
  H -- no --> J[showHome()]
  C --> K[ensureProductsInitialized()]
  subgraph src
    B
    K
  end
```

\

## Visual structure (SVG)

The diagram below is included as an SVG for a crisp, Git-friendly visual. If your renderer doesn't display it inline, open `media/structure.svg` directly.

![Project structure diagram](media/structure.svg)
