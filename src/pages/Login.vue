<template>
  <div class="login-page">
    <div class="container-custom">
      <div class="login-card">
        <!-- Left: brand / hero panel, same dark radial gradient as hero-card -->
        <div class="brand-panel">
          <div class="brand-panel-inner">
            <span class="brand-pill">BikeInfo</span>
            <h1 class="brand-title">Welcome back to the ride.</h1>
            <p class="brand-copy">
              Sign in to save your favorite motorcycles, compare specs side by side, and pick up your search right where you left off.
            </p>

            <div class="brand-stats">
              <div class="brand-stat">
                <strong>350cc</strong>
                <span>&amp; below lineup</span>
              </div>
              <div class="brand-stat">
                <strong>13+</strong>
                <span>brands covered</span>
              </div>
              <div class="brand-stat">
                <strong>2026</strong>
                <span>latest specs</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: form panel, same white card language as specs-section -->
        <div class="form-panel">
          <div class="form-panel-inner">
            <p class="section-kicker">Member Access</p>
            <h2 class="form-title">Log in to your account</h2>
            <p class="form-copy">Enter your details to continue exploring bikes.</p>

            <form class="login-form" @submit.prevent="handleLogin">
              <div class="field-block">
                <label class="field-label" for="email">Email address</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  class="text-input"
                />
              </div>

              <div class="field-block">
                <div class="field-row-header">
                  <label class="field-label" for="password">Password</label>
                  <router-link to="/forgot-password" class="inline-link">Forgot password?</router-link>
                </div>
                <div class="password-wrap">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="text-input"
                  />
                  <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>

              <div class="field-row-between">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
                  <span>Remember me</span>
                </label>
              </div>

              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

              <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Log In' }}
              </button>
            </form>

            <div class="divider"><span>or continue with</span></div>

            <div class="social-row">
              <button type="button" class="btn btn-secondary social-btn" @click="mockSocialLogin('Google')">
                Google
              </button>
              <button type="button" class="btn btn-secondary social-btn" @click="mockSocialLogin('Apple')">
                Apple
              </button>
            </div>

            <p class="signup-copy">
              New to BikeInfo?
              <router-link to="/signup" class="inline-link accent">Create an account</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  loading.value = true
  try {
    const user = await authStore.login(email.value, password.value)
    router.push(user.role === 'admin' ? '/admin' : '/bikes')
  } catch (err) {
    errorMessage.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

const mockSocialLogin = (provider) => {
  // Hook up real OAuth flow here
  console.log(`Continue with ${provider}`)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0 4rem;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f6 100%);
}

.login-card {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 0;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
}

/* ---------- Brand panel (mirrors hero-card) ---------- */
.brand-panel {
  background: radial-gradient(circle at top left, #1f2435 0%, #11131b 55%, #090b11 100%);
  color: white;
  display: flex;
  align-items: center;
  padding: 3rem 2.75rem;
}

.brand-panel-inner {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.brand-pill {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(255, 107, 53, 0.16);
  color: #ffb089;
  border: 1px solid rgba(255, 107, 53, 0.32);
}

.brand-title {
  font-size: clamp(1.9rem, 3vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0;
}

.brand-copy {
  margin: 0;
  max-width: 40ch;
  color: #c8cdd8;
  font-size: 1.02rem;
  line-height: 1.75;
}

.brand-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 0.6rem;
}

.brand-stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.8rem 0.7rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-stat strong {
  font-size: 1.15rem;
  color: white;
}

.brand-stat span {
  font-size: 0.72rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ---------- Form panel (mirrors specs-section) ---------- */
.form-panel {
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 3rem 2.75rem;
}

.form-panel-inner {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
}

.section-kicker {
  margin: 0 0 0.25rem 0;
  font-size: 0.78rem;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
}

.form-title {
  font-size: 1.6rem;
  margin: 0 0 0.4rem;
  color: #111827;
}

.form-copy {
  margin: 0 0 1.6rem 0;
  color: #64748b;
  line-height: 1.7;
  font-size: 0.98rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-row-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
}

.text-input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.text-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.12);
}

.password-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrap .text-input {
  padding-right: 3.2rem;
}

.toggle-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
  color: #94a3b8;
}

.toggle-btn:hover {
  color: var(--accent-color);
}

.field-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

.inline-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.inline-link:hover {
  color: var(--accent-color);
}

.inline-link.accent {
  color: var(--accent-color);
}

.error-text {
  margin: -0.4rem 0 0 0;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
}

/* ---------- Buttons (mirrors btn / btn-primary / btn-secondary) ---------- */
.btn {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.submit-btn.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), #ff7b3d);
  color: white;
  padding: 0.85rem 1.1rem;
  width: 100%;
}

.submit-btn.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(255, 107, 53, 0.25);
}

.submit-btn.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.6rem 0 1.2rem;
  color: #94a3b8;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.social-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.social-btn.btn-secondary {
  background: #f8fafc;
  color: #111827;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
}

.social-btn.btn-secondary:hover {
  background: #eef2f6;
}

.signup-copy {
  margin: 1.6rem 0 0 0;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    padding: 2.5rem 2rem;
  }

  .form-panel {
    padding: 2.5rem 2rem;
  }
}

@media (max-width: 480px) {
  .brand-stats {
    grid-template-columns: 1fr;
  }

  .social-row {
    grid-template-columns: 1fr;
  }
}
</style>