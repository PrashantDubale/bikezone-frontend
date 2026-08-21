# BikeZone — Frontend

A Vue 3 + Pinia frontend for **BikeZone**, a motorcycle marketplace app —
browse, filter, sort, and compare bikes, with a JWT-authenticated admin
dashboard for managing the catalog.

**Backend / API repo:** https://github.com/PrashantDubale/bikezone-backend

## Tech stack

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** — state management
- **Vue Router** — client-side routing, with an admin route guard
- **Vite** — build tool
- **Axios / fetch** — API calls to the FastAPI backend

## Features

- Browse bikes with live search, brand/category/price filtering, and sorting
- Bike detail pages with full specs
- Compare up to 4 bikes side by side
- Auth (signup/login) with JWT stored client-side
- Admin-only dashboard (route-guarded) for creating, editing, and deleting
  bike listings

## Project structure

```
bikezone-frontend/
├── src/
│   ├── pages/            # Home, BikesList, BikeDetail, Compare, Login, Signup, AdminBikes...
│   ├── components/        # BikeCard, FilterPanel, Navbar, Footer
│   ├── stores/             # bikeStore.js, authStore.js (Pinia)
│   ├── router/             # route definitions + admin auth guard
│   └── App.vue
├── .env.example
└── vite.config.js
```

## Running locally

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up environment variables** — copy `.env.example` to `.env`:
   ```
   VITE_API_BASE=http://localhost:8000/api
   ```
   Point this at your locally running backend (see the
   [backend repo](https://github.com/PrashantDubale/bikezone-backend) for
   setup), or at the deployed API.

3. **Run the dev server**
   ```
   npm run dev
   ```

4. **Build for production**
   ```
   npm run build
   ```

## Notes

- Auth state (JWT + user) persists in `localStorage` and is read on app load
  by `authStore.js`.
- Admin routes are protected in `router/index.js` — logged-out users are
  redirected to `/login`, logged-in non-admins to `/`.
