import { defineStore } from 'pinia'

const API_BASE = 'http://localhost:8000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('bikeinfo_token') || null,
    user: JSON.parse(localStorage.getItem('bikeinfo_user') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async register(payload) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || data.message || 'Registration failed')
      this.setSession(data.token, data.user)
      return data.user
    },

    async login(email, password) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || data.message || 'Login failed')
      this.setSession(data.token, data.user)
      return data.user
    },

    setSession(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('bikeinfo_token', token)
      localStorage.setItem('bikeinfo_user', JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('bikeinfo_token')
      localStorage.removeItem('bikeinfo_user')
    },

    // Adds "Authorization: Bearer <token>" to any fetch options object.
    // Use this for admin-only calls (create/update/delete bikes).
    authHeader() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {}
    }
  }
})