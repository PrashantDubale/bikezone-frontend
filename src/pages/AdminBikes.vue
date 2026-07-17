<template>
  <div class="admin-page">
    <div class="container-custom">
      <div class="admin-header">
        <div>
          <p class="section-kicker">Admin Dashboard</p>
          <h1>Manage bikes</h1>
          <p class="admin-copy">Add new arrivals or update existing listings. Changes go live for every visitor immediately.</p>
        </div>
        <button class="btn btn-primary" @click="openCreateForm">+ Add new bike</button>
      </div>

      <p v-if="loadError" class="error-text">{{ loadError }}</p>
      <p v-if="actionMessage" class="success-text">{{ actionMessage }}</p>

      <!-- ---------- Add / Edit form ---------- -->
      <div v-if="showForm" class="form-card">
        <div class="form-card-header">
          <h2>{{ editingId ? 'Edit bike' : 'Add new bike' }}</h2>
          <button class="close-btn" @click="closeForm">✕</button>
        </div>

        <form class="bike-form" @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="field-block">
              <label class="field-label">Brand</label>
              <input v-model.trim="form.brand" type="text" class="text-input" placeholder="Royal Enfield" required />
            </div>
            <div class="field-block">
              <label class="field-label">Model name</label>
              <input v-model.trim="form.name" type="text" class="text-input" placeholder="Hunter 350" required />
            </div>
            <div class="field-block">
              <label class="field-label">Category</label>
              <input v-model.trim="form.category" type="text" class="text-input" placeholder="Roadster" />
            </div>
            <div class="field-block">
              <label class="field-label">Launch year</label>
              <input v-model.number="form.launch_year" type="number" class="text-input" placeholder="2026" />
            </div>

            <div class="field-block">
              <label class="field-label">Engine (cc)</label>
              <input v-model.number="form.engine_cc" type="number" class="text-input" placeholder="349" />
            </div>
            <div class="field-block">
              <label class="field-label">Horsepower</label>
              <input v-model.number="form.horsepower" type="number" step="0.1" class="text-input" placeholder="20.2" />
            </div>
            <div class="field-block">
              <label class="field-label">Torque (Nm)</label>
              <input v-model.number="form.torque" type="number" step="0.1" class="text-input" placeholder="27" />
            </div>
            <div class="field-block">
              <label class="field-label">Top speed (km/h)</label>
              <input v-model.number="form.top_speed" type="number" class="text-input" placeholder="114" />
            </div>

            <div class="field-block">
              <label class="field-label">Mileage (km/l)</label>
              <input v-model.number="form.mileage" type="number" class="text-input" placeholder="35" />
            </div>
            <div class="field-block">
              <label class="field-label">Gearbox</label>
              <input v-model.trim="form.gearbox" type="text" class="text-input" placeholder="5-speed" />
            </div>
            <div class="field-block">
              <label class="field-label">Cooling system</label>
              <input v-model.trim="form.cooling_system" type="text" class="text-input" placeholder="Air-oil cooled" />
            </div>
            <div class="field-block">
              <label class="field-label">Fuel tank (L)</label>
              <input v-model.number="form.fuel_tank" type="number" step="0.1" class="text-input" placeholder="13" />
            </div>

            <div class="field-block">
              <label class="field-label">Price (₹, numeric)</label>
              <input v-model.number="form.price" type="number" class="text-input" placeholder="150000" required />
            </div>
            <div class="field-block">
              <label class="field-label">Price range (display text)</label>
              <input v-model.trim="form.price_range" type="text" class="text-input" placeholder="1,50,000 - 1,80,000" />
            </div>
          </div>

          <div class="field-block">
            <label class="field-label">Image URLs <span class="optional-tag">(one per line, first one is used as the thumbnail)</span></label>
            <textarea v-model="imagesText" class="text-input textarea-input" rows="3" placeholder="https://example.com/bike1.png"></textarea>
          </div>

          <label class="checkbox-field">
            <input type="checkbox" v-model="form.is_new" />
            <span>Mark as "New Arrival"</span>
          </label>

          <label class="checkbox-field">
            <input type="checkbox" v-model="form.is_featured" />
            <span>Set as Homepage Featured pick (only one bike can be featured at a time)</span>
          </label>

          <p v-if="formError" class="error-text">{{ formError }}</p>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : editingId ? 'Save changes' : 'Add bike' }}
            </button>
          </div>
        </form>
      </div>

      <!-- ---------- Bikes table ---------- -->
      <div class="table-card">
        <div class="table-toolbar">
          <input v-model="search" type="text" class="text-input search-input" placeholder="Search bikes..." />
          <span class="count-label">{{ filteredBikes.length }} bikes</span>
        </div>

        <p v-if="loading" class="loading-text">Loading bikes...</p>

        <table v-else class="bike-table">
          <thead>
            <tr>
              <th>Bike</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>New</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bike in filteredBikes" :key="bike.id" :class="{ 'row-dirty': isDirty(bike.id) }">
              <td class="bike-cell">
                <img :src="bike.image || placeholderImg" :alt="bike.name" class="thumb" />
                <span>{{ bike.name }}</span>
              </td>
              <td>{{ bike.brand }}</td>
              <td>{{ bike.category }}</td>
              <td>₹{{ formatPrice(bike.price) }}</td>
              <td>
                <label class="mini-toggle">
                  <input type="checkbox" :checked="displayIsNew(bike)" @change="stageToggle(bike, 'is_new')" />
                  <span v-if="displayIsNew(bike)" class="new-badge">New</span>
                </label>
              </td>
              <td>
                <label class="mini-toggle">
                  <input type="checkbox" :checked="displayIsFeatured(bike)" @change="stageToggle(bike, 'is_featured')" />
                  <span v-if="displayIsFeatured(bike)" class="featured-badge">★ Featured</span>
                </label>
              </td>
              <td class="actions-cell">
                <button class="icon-btn" @click="openEditForm(bike)">Edit</button>
                <button class="icon-btn danger" @click="confirmDelete(bike)">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredBikes.length === 0">
              <td colspan="7" class="empty-cell">No bikes match your search.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ---------- Floating save bar for pending table changes ---------- -->
    <Transition name="slide-up">
      <div v-if="pendingCount > 0" class="save-bar">
        <span class="save-bar-text">{{ pendingCount }} unsaved change{{ pendingCount > 1 ? 's' : '' }}</span>
        <div class="save-bar-actions">
          <button class="btn btn-secondary" @click="discardChanges" :disabled="savingBatch">Discard</button>
          <button class="btn btn-primary" @click="saveAllChanges" :disabled="savingBatch">
            {{ savingBatch ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const API_BASE = import.meta.env.VITE_API_BASE
const authStore = useAuthStore()

const bikes = ref([])
const loading = ref(true)
const loadError = ref('')
const actionMessage = ref('')
const search = ref('')

const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const formError = ref('')
const imagesText = ref('')
const placeholderImg = 'https://placehold.co/80x60?text=No+Image'

const emptyForm = () => ({
  brand: '',
  name: '',
  category: '',
  launch_year: null,
  engine_cc: null,
  horsepower: null,
  torque: null,
  top_speed: null,
  mileage: null,
  gearbox: '',
  cooling_system: '',
  fuel_tank: null,
  price: null,
  price_range: '',
  is_new: false,
  is_featured: false
})

const form = reactive(emptyForm())

const filteredBikes = computed(() => {
  const s = search.value.toLowerCase()
  return bikes.value.filter(
    (b) => b.name.toLowerCase().includes(s) || b.brand.toLowerCase().includes(s)
  )
})

const formatPrice = (price) => (price ? Number(price).toLocaleString('en-IN') : '—')

// FastAPI errors come back as { detail: "..." }, the old Node backend
// used { message: "..." } — check both so error text always shows.
const extractErrorMessage = (data, fallback) => {
  if (!data) return fallback
  if (typeof data.detail === 'string') return data.detail
  if (typeof data.message === 'string') return data.message
  return fallback
}

const fetchBikes = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetch(`${API_BASE}/bikes`)
    if (!res.ok) throw new Error('Failed to load bikes')
    bikes.value = await res.json()
  } catch (err) {
    loadError.value = 'Could not load bikes. Is the API server running?'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBikes)

const openCreateForm = () => {
  editingId.value = null
  Object.assign(form, emptyForm())
  imagesText.value = ''
  formError.value = ''
  showForm.value = true
}

const openEditForm = (bike) => {
  editingId.value = bike.id
  Object.assign(form, {
    brand: bike.brand,
    name: bike.name,
    category: bike.category,
    launch_year: bike.launch_year,
    engine_cc: bike.engine_cc,
    horsepower: bike.horsepower,
    torque: bike.torque,
    top_speed: bike.top_speed,
    mileage: bike.mileage,
    gearbox: bike.gearbox,
    cooling_system: bike.cooling_system,
    fuel_tank: bike.fuel_tank,
    price: bike.price,
    price_range: bike.price_range,
    is_new: !!bike.is_new,
    is_featured: !!bike.is_featured
  })
  imagesText.value = (bike.images || []).join('\n')
  formError.value = ''
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingId.value = null
}

const submitForm = async () => {
  formError.value = ''

  if (!form.brand || !form.name || !form.price) {
    formError.value = 'Brand, model name, and price are required.'
    return
  }

  const images = imagesText.value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const payload = {
    ...form,
    images,
    image: images[0] || ''
  }

  if (!editingId.value) {
    payload.id = `${form.brand}-${form.name}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  saving.value = true
  try {
    const url = editingId.value ? `${API_BASE}/bikes/${editingId.value}` : `${API_BASE}/bikes`
    const method = editingId.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authStore.authHeader()
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(extractErrorMessage(data, 'Save failed'))

    actionMessage.value = editingId.value ? 'Bike updated.' : 'Bike added.'
    closeForm()
    await fetchBikes()
    setTimeout(() => (actionMessage.value = ''), 3000)
  } catch (err) {
    formError.value = err.message || 'Something went wrong while saving.'
  } finally {
    saving.value = false
  }
}

// ---------- Batch toggle staging (New / Featured) ----------
// Toggling a checkbox in the table doesn't save immediately.
// Changes are staged here (keyed by bike id) until the admin clicks
// "Save changes" in the floating bar, so multiple edits can be made
// and committed together in one go.
const pendingChanges = reactive({})
const savingBatch = ref(false)

const pendingCount = computed(() => Object.keys(pendingChanges).length)

const isDirty = (bikeId) => Object.prototype.hasOwnProperty.call(pendingChanges, bikeId)

const displayIsNew = (bike) =>
  isDirty(bike.id) && 'is_new' in pendingChanges[bike.id]
    ? pendingChanges[bike.id].is_new
    : !!bike.is_new

const displayIsFeatured = (bike) => {
  // If THIS bike has a staged is_featured value, use it.
  if (isDirty(bike.id) && 'is_featured' in pendingChanges[bike.id]) {
    return pendingChanges[bike.id].is_featured
  }
  // Otherwise, if some OTHER bike is being staged as featured, this one
  // should visually un-feature immediately (only one can be featured).
  const someOtherStagedFeatured = Object.entries(pendingChanges).find(
    ([id, change]) => id !== bike.id && change.is_featured === true
  )
  if (someOtherStagedFeatured) return false
  return !!bike.is_featured
}

const stageToggle = (bike, field) => {
  const currentDisplay = field === 'is_new' ? displayIsNew(bike) : displayIsFeatured(bike)
  const next = !currentDisplay

  if (!pendingChanges[bike.id]) pendingChanges[bike.id] = {}

  const originalValue = !!bike[field]
  if (next === originalValue) {
    delete pendingChanges[bike.id][field]
    if (Object.keys(pendingChanges[bike.id]).length === 0) {
      delete pendingChanges[bike.id]
    }
  } else {
    pendingChanges[bike.id][field] = next
  }

  // Enforce single-featured in the staged state: if this bike is being
  // staged as featured, stage every other currently-featured bike as
  // not-featured too, so the UI reflects the exclusivity immediately.
  if (field === 'is_featured' && next === true) {
    bikes.value.forEach((other) => {
      if (other.id === bike.id) return
      if (displayIsFeatured(other)) {
        if (!pendingChanges[other.id]) pendingChanges[other.id] = {}
        pendingChanges[other.id].is_featured = false
      }
    })
  }
}

const discardChanges = () => {
  Object.keys(pendingChanges).forEach((key) => delete pendingChanges[key])
}

const saveAllChanges = async () => {
  savingBatch.value = true
  loadError.value = ''
  const entries = Object.entries(pendingChanges)

  try {
    const results = await Promise.all(
      entries.map(([bikeId, change]) => {
        const bike = bikes.value.find((b) => b.id === bikeId)
        return fetch(`${API_BASE}/bikes/${bikeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...authStore.authHeader()
          },
          body: JSON.stringify({
            brand: bike?.brand,
            name: bike?.name,
            price: bike?.price,
            ...change
          })
        })
      })
    )

    const failed = results.some((r) => !r.ok)
    if (failed) throw new Error('Some changes could not be saved. Please try again.')

    discardChanges()
    actionMessage.value = `${entries.length} bike${entries.length > 1 ? 's' : ''} updated.`
    await fetchBikes()
    setTimeout(() => (actionMessage.value = ''), 3000)
  } catch (err) {
    loadError.value = err.message || 'Failed to save changes.'
  } finally {
    savingBatch.value = false
  }
}

const confirmDelete = async (bike) => {
  if (!window.confirm(`Delete "${bike.name}"? This can't be undone.`)) return

  try {
    const res = await fetch(`${API_BASE}/bikes/${bike.id}`, {
      method: 'DELETE',
      headers: { ...authStore.authHeader() }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(extractErrorMessage(data, 'Delete failed'))

    actionMessage.value = 'Bike deleted.'
    await fetchBikes()
    setTimeout(() => (actionMessage.value = ''), 3000)
  } catch (err) {
    loadError.value = err.message || 'Failed to delete bike.'
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 2.5rem 0 4rem;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f6 100%);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.6rem;
}

.section-kicker {
  margin: 0 0 0.2rem 0;
  font-size: 0.78rem;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
}

.admin-header h1 {
  margin: 0 0 0.3rem 0;
  font-size: 2rem;
  color: #111827;
}

.admin-copy {
  margin: 0;
  color: #64748b;
  max-width: 52ch;
  line-height: 1.6;
}

.btn {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.92rem;
  padding: 0.75rem 1.2rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), #ff7b3d);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(255, 107, 53, 0.25);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #111827;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.error-text {
  color: #dc2626;
  font-weight: 600;
  font-size: 0.9rem;
}

.success-text {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.9rem;
}

/* ---------- Form card ---------- */
.form-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.6rem;
  margin-bottom: 1.6rem;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
}

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.form-card-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #94a3b8;
}

.close-btn:hover {
  color: #111827;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #111827;
}

.optional-tag {
  font-weight: 500;
  color: #94a3b8;
}

.text-input {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 0.92rem;
  color: #111827;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  border-color: var(--accent-color);
}

.textarea-input {
  resize: vertical;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.9rem 0 0.4rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: #111827;
  cursor: pointer;
}

.checkbox-field input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 0.4rem;
}

/* ---------- Table ---------- */
.table-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.4rem;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  max-width: 280px;
}

.count-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
}

.loading-text,
.empty-cell {
  text-align: center;
  color: #64748b;
  padding: 2rem 0;
}

.bike-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.bike-table th {
  text-align: left;
  padding: 0.7rem;
  color: #64748b;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e2e8f0;
}

.bike-table td {
  padding: 0.7rem;
  border-bottom: 1px solid #f1f5f9;
  color: #111827;
}

.bike-cell {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 700;
}

.thumb {
  width: 52px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  background: #f1f5f9;
}

.mini-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

.mini-toggle input {
  width: 15px;
  height: 15px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

.new-badge {
  background: rgba(255, 107, 53, 0.12);
  color: var(--accent-color);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.featured-badge {
  background: rgba(79, 70, 229, 0.12);
  color: var(--primary-color);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.4rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  color: #111827;
}

.icon-btn:hover {
  background: #eef2f6;
}

.icon-btn.danger {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.25);
}

.icon-btn.danger:hover {
  background: rgba(220, 38, 38, 0.08);
}

.row-dirty {
  background: rgba(255, 107, 53, 0.06);
}

/* ---------- Floating save bar ---------- */
.save-bar {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: #111827;
  color: #fff;
  padding: 0.8rem 1rem 0.8rem 1.3rem;
  border-radius: 999px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  z-index: 200;
}

.save-bar-text {
  font-size: 0.88rem;
  font-weight: 700;
  white-space: nowrap;
}

.save-bar-actions {
  display: flex;
  gap: 0.5rem;
}

.save-bar .btn {
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
}

.save-bar .btn-secondary {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.save-bar .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>