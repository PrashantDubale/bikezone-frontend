<template>
  <div class="login-page">
    <div class="container-custom">
      <div class="login-card">
        <!-- Left: brand / hero panel, same dark radial gradient as hero-card -->
        <div class="brand-panel">
          <div class="brand-panel-inner">
            <span class="brand-pill">BikeInfo</span>
            <h1 class="brand-title">Join the ride.</h1>
            <p class="brand-copy">
              Create your free account to save favorites, build comparisons, and get personalized picks across every 350cc-and-below bike in India.
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

            <ul class="perk-list">
              <li>Save unlimited favorite bikes</li>
              <li>Compare up to 3 bikes side by side</li>
              <li>Get notified when prices change</li>
            </ul>
          </div>
        </div>

        <!-- Right: form panel, same white card language as specs-section -->
        <div class="form-panel">
          <div class="form-panel-inner">
            <p class="section-kicker">Create Account</p>
            <h2 class="form-title">Sign up for free</h2>
            <p class="form-copy">It only takes a minute to get started.</p>

            <form class="login-form" @submit.prevent="handleSignup" novalidate>
              <div class="name-row">
                <div class="field-block">
                  <label class="field-label" for="firstName">First name</label>
                  <input
                    id="firstName"
                    v-model.trim="firstName"
                    type="text"
                    placeholder="Rahul"
                    class="text-input"
                    :class="{ 'input-error': touched.firstName && errors.firstName }"
                    @blur="touched.firstName = true"
                  />
                  <span v-if="touched.firstName && errors.firstName" class="field-error">{{ errors.firstName }}</span>
                </div>

                <div class="field-block">
                  <label class="field-label" for="lastName">Last name</label>
                  <input
                    id="lastName"
                    v-model.trim="lastName"
                    type="text"
                    placeholder="Verma"
                    class="text-input"
                    :class="{ 'input-error': touched.lastName && errors.lastName }"
                    @blur="touched.lastName = true"
                  />
                  <span v-if="touched.lastName && errors.lastName" class="field-error">{{ errors.lastName }}</span>
                </div>
              </div>

              <div class="field-block">
                <label class="field-label" for="email">Email address</label>
                <input
                  id="email"
                  v-model.trim="email"
                  type="email"
                  placeholder="you@example.com"
                  class="text-input"
                  :class="{ 'input-error': touched.email && errors.email }"
                  @blur="touched.email = true"
                />
                <span v-if="touched.email && errors.email" class="field-error">{{ errors.email }}</span>
              </div>

              <div class="field-block">
                <label class="field-label" for="phone">Phone number <span class="optional-tag">(optional)</span></label>
                <input
                  id="phone"
                  v-model.trim="phone"
                  type="tel"
                  placeholder="98765 43210"
                  class="text-input"
                  :class="{ 'input-error': touched.phone && errors.phone }"
                  @blur="touched.phone = true"
                />
                <span v-if="touched.phone && errors.phone" class="field-error">{{ errors.phone }}</span>
              </div>

              <div class="field-block">
                <label class="field-label" for="password">Password</label>
                <div class="password-wrap">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Create a password"
                    class="text-input"
                    :class="{ 'input-error': touched.password && errors.password }"
                    @blur="touched.password = true"
                  />
                  <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>

                <div class="strength-meter" v-if="password">
                  <div class="strength-bar">
                    <span
                      v-for="n in 4"
                      :key="n"
                      class="strength-seg"
                      :class="{ filled: n <= passwordStrength.score }"
                      :style="n <= passwordStrength.score ? { background: passwordStrength.color } : {}"
                    ></span>
                  </div>
                  <span class="strength-label" :style="{ color: passwordStrength.color }">{{ passwordStrength.label }}</span>
                </div>

                <span v-if="touched.password && errors.password" class="field-error">{{ errors.password }}</span>
                <p class="hint-text">Use 8+ characters with a mix of letters, numbers &amp; symbols.</p>
              </div>

              <div class="field-block">
                <label class="field-label" for="confirmPassword">Confirm password</label>
                <div class="password-wrap">
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Re-enter your password"
                    class="text-input"
                    :class="{ 'input-error': touched.confirmPassword && errors.confirmPassword }"
                    @blur="touched.confirmPassword = true"
                  />
                  <button type="button" class="toggle-btn" @click="showConfirmPassword = !showConfirmPassword">
                    {{ showConfirmPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <span v-if="touched.confirmPassword && errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
              </div>

              <div class="field-row-between terms-row">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="agreeToTerms" class="checkbox-input" @change="touched.agreeToTerms = true" />
                  <span>
                    I agree to the
                    <router-link to="/terms" class="inline-link accent">Terms of Service</router-link>
                    and
                    <router-link to="/privacy" class="inline-link accent">Privacy Policy</router-link>
                  </span>
                </label>
              </div>
              <span v-if="touched.agreeToTerms && errors.agreeToTerms" class="field-error">{{ errors.agreeToTerms }}</span>

              <label class="checkbox-label">
                <input type="checkbox" v-model="subscribeNewsletter" class="checkbox-input" />
                <span>Send me new bike launches and price drop alerts</span>
              </label>

              <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
              <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

              <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
                {{ loading ? 'Creating account...' : 'Create Account' }}
              </button>
            </form>

            <div class="divider"><span>or sign up with</span></div>

            <div class="social-row">
              <button type="button" class="btn btn-secondary social-btn" @click="mockSocialSignup('Google')">
                Google
              </button>
              <button type="button" class="btn btn-secondary social-btn" @click="mockSocialSignup('Apple')">
                Apple
              </button>
            </div>

            <p class="signup-copy">
              Already have an account?
              <router-link to="/login" class="inline-link accent">Log in</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const subscribeNewsletter = ref(true)

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const touched = reactive({
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
  password: false,
  confirmPassword: false,
  agreeToTerms: false
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9\s+-]{7,15}$/

const errors = computed(() => {
  const e = {}

  if (!firstName.value) e.firstName = 'First name is required.'
  if (!lastName.value) e.lastName = 'Last name is required.'

  if (!email.value) {
    e.email = 'Email is required.'
  } else if (!emailPattern.test(email.value)) {
    e.email = 'Enter a valid email address.'
  }

  if (phone.value && !phonePattern.test(phone.value)) {
    e.phone = 'Enter a valid phone number.'
  }

  if (!password.value) {
    e.password = 'Password is required.'
  } else if (password.value.length < 8) {
    e.password = 'Password must be at least 8 characters.'
  }

  if (!confirmPassword.value) {
    e.confirmPassword = 'Please confirm your password.'
  } else if (confirmPassword.value !== password.value) {
    e.confirmPassword = 'Passwords do not match.'
  }

  if (!agreeToTerms.value) {
    e.agreeToTerms = 'You must accept the Terms of Service to continue.'
  }

  return e
})

const isFormValid = computed(() => Object.keys(errors.value).length === 0)

const passwordStrength = computed(() => {
  const val = password.value
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++

  const levels = [
    { label: 'Weak', color: '#dc2626' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#3b82f6' },
    { label: 'Strong', color: '#16a34a' }
  ]

  const clamped = Math.max(1, score)
  return { score: clamped, ...levels[clamped - 1] }
})

const markAllTouched = () => {
  Object.keys(touched).forEach(key => {
    touched[key] = true
  })
}

const handleSignup = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  markAllTouched()

  if (!isFormValid.value) {
    errorMessage.value = 'Please fix the highlighted fields before continuing.'
    return
  }

  loading.value = true
  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      subscribeNewsletter: subscribeNewsletter.value
    })
    successMessage.value = 'Account created! Redirecting...'
    setTimeout(() => router.push('/bikes'), 800)
  } catch (err) {
    errorMessage.value = err.message || 'Something went wrong while creating your account. Please try again.'
  } finally {
    loading.value = false
  }
}

const mockSocialSignup = (provider) => {
  // Hook up real OAuth flow here
  console.log(`Sign up with ${provider}`)
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

.perk-list {
  list-style: none;
  padding: 0;
  margin: 0.4rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.perk-list li {
  position: relative;
  padding-left: 1.5rem;
  color: #dbe1ea;
  font-size: 0.92rem;
  line-height: 1.5;
}

.perk-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #ffb089;
  font-weight: 800;
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
  max-width: 420px;
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
  gap: 1rem;
}

.name-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
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

.optional-tag {
  font-weight: 500;
  color: #94a3b8;
  text-transform: none;
  letter-spacing: 0;
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

.text-input.input-error {
  border-color: #dc2626;
}

.text-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
}

.field-error {
  font-size: 0.78rem;
  color: #dc2626;
  font-weight: 600;
}

.hint-text {
  margin: 0.15rem 0 0 0;
  font-size: 0.76rem;
  color: #94a3b8;
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

.strength-meter {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.2rem;
}

.strength-bar {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-seg {
  height: 5px;
  flex: 1;
  border-radius: 999px;
  background: #e2e8f0;
}

.strength-label {
  font-size: 0.74rem;
  font-weight: 700;
  min-width: 42px;
}

.field-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terms-row {
  margin-top: 0.2rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.86rem;
  color: #475569;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  margin-top: 0.15rem;
  accent-color: var(--accent-color);
  cursor: pointer;
  flex-shrink: 0;
}

.inline-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 700;
  font-size: inherit;
  transition: color 0.3s ease;
}

.inline-link:hover {
  color: var(--accent-color);
}

.inline-link.accent {
  color: var(--accent-color);
}

.error-text {
  margin: 0;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
}

.success-text {
  margin: 0;
  color: #16a34a;
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
  margin-top: 0.3rem;
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

@media (max-width: 560px) {
  .name-row {
    grid-template-columns: 1fr;
  }

  .brand-stats {
    grid-template-columns: 1fr;
  }

  .social-row {
    grid-template-columns: 1fr;
  }
}
</style>