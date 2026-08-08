<template>
  <nav class="navbar glass">
    <div class="container-custom">
      <div class="nav-content">
        <router-link to="/" class="logo-section" @click="mobileMenuOpen = false">
          <img :src="logoUrl" alt="BikeZone" class="logo-image" />
        </router-link>

        <!-- Desktop links (hidden on mobile via CSS) -->
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/bikes" class="nav-link">Browse</router-link>
          <router-link to="/compare" class="nav-link compare-link">
            <span>Compare</span>
            <span class="badge" v-if="bikeStore.compareCart.length > 0">{{ bikeStore.compareCart.length }}</span>
          </router-link>
          <router-link to="/reviews" class="nav-link">Reviews</router-link>

          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link admin-link">
            Admin
          </router-link>

          <router-link v-if="!authStore.isLoggedIn" to="/login" class="nav-link">Log In</router-link>
          <button v-else class="nav-link logout-btn" @click="showLogoutModal = true">Log Out</button>
        </div>

        <!-- Hamburger toggle, mobile/tablet only -->
        <button
          type="button"
          class="menu-toggle"
          :class="{ open: mobileMenuOpen }"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile drawer + backdrop, teleported to <body> so it's never trapped
       inside .navbar's backdrop-filter containing block -->
  <Teleport to="body">
    <div v-if="mobileMenuOpen" class="nav-backdrop" @click="mobileMenuOpen = false"></div>

    <div class="mobile-drawer" :class="{ 'mobile-drawer-open': mobileMenuOpen }">
      <div class="mobile-drawer-header">
        <span>Menu</span>
        <button type="button" class="drawer-close" @click="mobileMenuOpen = false" aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <router-link to="/" class="mobile-link" @click="mobileMenuOpen = false">Home</router-link>
      <router-link to="/bikes" class="mobile-link" @click="mobileMenuOpen = false">Browse</router-link>
      <router-link to="/compare" class="mobile-link" @click="mobileMenuOpen = false">
        Compare
        <span class="badge" v-if="bikeStore.compareCart.length > 0">{{ bikeStore.compareCart.length }}</span>
      </router-link>
      <router-link to="/reviews" class="mobile-link" @click="mobileMenuOpen = false">Reviews</router-link>

      <router-link v-if="authStore.isAdmin" to="/admin" class="mobile-link admin-link" @click="mobileMenuOpen = false">
        Admin
      </router-link>

      <router-link v-if="!authStore.isLoggedIn" to="/login" class="mobile-link" @click="mobileMenuOpen = false">Log In</router-link>
      <button v-else class="mobile-link logout-btn" @click="mobileMenuOpen = false; showLogoutModal = true">Log Out</button>
    </div>
  </Teleport>

  <!-- Logout confirmation modal -->
  <Teleport to="body">
    <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
      <div class="modal-card">
        <h3 class="modal-title">Log out?</h3>
        <p class="modal-text">
          You'll be logged out of <strong>{{ authStore.user?.email || 'your account' }}</strong>.
        </p>
        <div class="modal-actions">
          <button class="modal-btn cancel-btn" @click="showLogoutModal = false">Cancel</button>
          <button class="modal-btn confirm-btn" @click="confirmLogout">Log Out</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBikeStore } from '../stores/bikeStore'
import { useAuthStore } from '../stores/authStore'

const bikeStore = useBikeStore()
const authStore = useAuthStore()
const router = useRouter()

const logoUrl = `${import.meta.env.VITE_API_BASE}/assets/logo`
const showLogoutModal = ref(false)
const mobileMenuOpen = ref(false)

// Lock background scroll while the mobile menu is open
watch(mobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

const confirmLogout = () => {
  showLogoutModal.value = false
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(148,163,184,0.2);
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.nav-content { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 0; gap: 1rem; }
.logo-section { display:flex; align-items:center; text-decoration:none; color:var(--text-primary); transition: transform 0.25s ease; flex-shrink: 0; }
.logo-section:hover { transform: translateY(-1px); }
.logo-image { height: 64px; width: auto; display: block; }
.nav-links { display:flex; gap:1.1rem; align-items:center; }
.nav-link { text-decoration:none; color:var(--text-primary); font-weight:700; font-size:0.92rem; position:relative; transition: color 0.25s ease; display:flex; align-items:center; gap:0.4rem; white-space: nowrap; }
.nav-link:hover { color: var(--accent-color); }
.nav-link.router-link-active { color: var(--accent-color); }
.nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px; background-color: var(--accent-color); transition: width 0.25s ease; }
.nav-link.router-link-active::after, .nav-link:hover::after { width: 100%; }
.badge { background: var(--accent-color); color: white; width: 1.35rem; height: 1.35rem; border-radius: 999px; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; }
.compare-link { padding: 0.5rem 0.8rem; border-radius: 999px; background: rgba(255,107,53,0.12); color: var(--accent-color) !important; }
.compare-link:hover { background: rgba(255,107,53,0.2); }
.admin-link { color: var(--accent-color) !important; }
.logout-btn {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
}

/* ---------- Hamburger toggle ---------- */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: rgba(148, 163, 184, 0.12);
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.menu-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  margin: 0 auto;
  background: var(--text-primary);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.menu-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-toggle.open span:nth-child(2) { opacity: 0; }
.menu-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ---------- Tablets and phones ---------- */
@media (max-width: 900px) {
  .menu-toggle { display: flex; }
  .nav-links { display: none; } /* replaced by teleported mobile-drawer */
}

/* Logout modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.15s ease;
  padding: 1rem;
}
.modal-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.75rem;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  animation: popIn 0.18s ease;
}
.modal-title { margin: 0 0 0.5rem; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
.modal-text { margin: 0 0 1.4rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5; }
.modal-actions { display: flex; gap: 0.7rem; justify-content: flex-end; }
.modal-btn { padding: 0.55rem 1.1rem; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: none; font-family: inherit; transition: opacity 0.2s ease, transform 0.15s ease; }
.modal-btn:hover { transform: translateY(-1px); }
.cancel-btn { background: rgba(148,163,184,0.15); color: var(--text-primary); }
.confirm-btn { background: var(--accent-color); color: #fff; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>

<style>
/* Unscoped: these live in a teleported <body>-level tree, so `scoped`
   attribute selectors from this component would never match them. */

.nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 998;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  height: 100vh;
  width: min(300px, 82vw);
  background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem 2rem;
  box-shadow: -12px 0 40px rgba(15, 23, 42, 0.18);
  transition: right 0.28s ease;
  overflow-y: auto;
}

.mobile-drawer-open {
  right: 0;
}

.mobile-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--text-primary);
  padding: 1.25rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky;
  top: 0;
  background: #fff;
}

.drawer-close {
  background: rgba(148, 163, 184, 0.12);
  border: none;
  border-radius: 999px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  cursor: pointer;
}

.mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.mobile-link.router-link-active {
  color: var(--accent-color);
}

.mobile-link.admin-link {
  color: var(--accent-color);
}

.mobile-link.logout-btn {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.mobile-drawer .badge {
  background: var(--accent-color);
  color: white;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
}
</style>