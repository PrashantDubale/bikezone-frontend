<template>
  <div class="compare-page">
    <div class="container-custom">
      <div class="page-header">
        <p class="eyebrow">BikeZone compare suite</p>
        <h1>Compare motorcycles clearly</h1>
        <p>See performance, value, and practicality in one polished view.</p>
      </div>

      <div v-if="bikeStore.compareCart.length === 0" class="empty-state">
        <p class="empty-icon">🏍️</p>
        <h3>No bikes selected yet</h3>
        <p>Pick up to four motorcycles from the browse page and compare their key details instantly.</p>
        <router-link to="/bikes" class="btn-cta">Browse bikes</router-link>
      </div>

      <div v-else class="compare-shell">
        <div class="compare-cards">
          <article v-for="bike in bikeStore.compareCart" :key="bike.id" class="bike-card">
            <div class="bike-card-top">
              <img :src="bike.image" :alt="bike.name" class="bike-thumb" />
              <div class="bike-meta">
                <p class="bike-brand">{{ bike.brand }}</p>
                <h2>{{ bike.name }}</h2>
                <p class="bike-price">₹{{ formatPrice(bike.price) }}</p>
              </div>
            </div>
            <button class="remove-btn" @click="removeBike(bike.id)">Remove</button>
          </article>
        </div>

        <div class="table-card">
          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th class="spec-label-head">Specification</th>
                  <th v-for="bike in bikeStore.compareCart" :key="bike.id" class="bike-head">
                    <div class="bike-head-inner">
                      <span class="bike-name">{{ bike.name }}</span>
                      <span class="bike-brand">{{ bike.brand }}</span>
                      <span class="bike-price">₹{{ formatPrice(bike.price) }}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in specRows" :key="row.key">
                  <th class="spec-label-cell">{{ row.label }}</th>
                  <td
                    v-for="bike in bikeStore.compareCart"
                    :key="bike.id"
                    class="value-cell"
                    :class="{ 'best-value': isBestValue(row.key, bike) }"
                  >
                    <span class="value-text">{{ formatCellValue(row.key, bike) }}</span>
                    <span v-if="isBestValue(row.key, bike)" class="trophy-badge">🏆</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="comparison-actions">
          <button class="btn-secondary" @click="clearCompare">Clear comparison</button>
          <router-link to="/bikes" class="btn-primary">Add more bikes</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBikeStore } from '../stores/bikeStore'

const bikeStore = useBikeStore()

const specRows = computed(() => [
  { key: 'price', label: 'Price' },
  { key: 'engine_cc', label: 'Engine CC' },
  { key: 'horsepower', label: 'Power' },
  { key: 'torque', label: 'Torque' },
  { key: 'mileage', label: 'Mileage' },
  { key: 'top_speed', label: 'Top Speed' },
  { key: 'kerb_weight', label: 'Weight' },
  { key: 'seat_height', label: 'Seat Height' },
  { key: 'ground_clearance', label: 'Ground Clearance' },
  { key: 'fuel_tank', label: 'Fuel Tank' },
  { key: 'abs_type', label: 'ABS' },
  { key: 'brakes', label: 'Brakes' },
  { key: 'tyres', label: 'Tyres' }
])

const removeBike = (bikeId) => {
  bikeStore.removeFromCompare(bikeId)
}

const clearCompare = () => {
  bikeStore.clearCompare()
}

const formatPrice = (price) => {
  return (price / 100000).toFixed(2)
}

const formatCellValue = (key, bike) => {
  switch (key) {
    case 'price':
      return `₹${formatPrice(bike.price)}`
    case 'engine_cc':
      return bike.engine_cc ? `${bike.engine_cc} cc` : '—'
    case 'horsepower':
      return bike.horsepower ? `${bike.horsepower} hp` : '—'
    case 'torque':
      return bike.torque ? `${bike.torque} Nm` : '—'
    case 'mileage':
      return bike.mileage ? `${bike.mileage} km/l` : '—'
    case 'top_speed':
      return bike.top_speed ? `${bike.top_speed} km/h` : '—'
    case 'kerb_weight':
      return bike.kerb_weight ? `${bike.kerb_weight} kg` : '—'
    case 'seat_height':
      return bike.seat_height ? `${bike.seat_height} mm` : '—'
    case 'ground_clearance':
      return bike.ground_clearance ? `${bike.ground_clearance} mm` : '—'
    case 'fuel_tank':
      return bike.fuel_tank ? `${bike.fuel_tank} L` : '—'
    case 'abs_type':
      return bike.abs_type || '—'
    case 'brakes':
      return bike.brakes || bike.abs_type || '—'
    case 'tyres':
      return `${bike.front_tyre || '—'} / ${bike.rear_tyre || '—'}`
    default:
      return '—'
  }
}

const getNumericValue = (key, bike) => {
  switch (key) {
    case 'price':
      return Number(bike.price) || 0
    case 'engine_cc':
      return Number(bike.engine_cc) || 0
    case 'horsepower':
      return Number(bike.horsepower) || 0
    case 'torque':
      return Number(bike.torque) || 0
    case 'mileage':
      return Number(bike.mileage) || 0
    case 'top_speed':
      return Number(bike.top_speed) || 0
    case 'kerb_weight':
      return Number(bike.kerb_weight) || 0
    case 'seat_height':
      return Number(bike.seat_height) || 0
    case 'ground_clearance':
      return Number(bike.ground_clearance) || 0
    case 'fuel_tank':
      return Number(bike.fuel_tank) || 0
    default:
      return null
  }
}

const isBestValue = (key, bike) => {
  if (bikeStore.compareCart.length < 2) return false

  const currentValue = getNumericValue(key, bike)
  if (currentValue === null) return false

  const values = bikeStore.compareCart.map((item) => getNumericValue(key, item)).filter((value) => value !== null)
  if (!values.length) return false

  const bestValue = ['price', 'kerb_weight', 'seat_height'].includes(key)
    ? Math.min(...values)
    : Math.max(...values)

  return currentValue === bestValue
}
</script>

<style scoped>
.compare-page {
  padding: 2rem 0 4rem;
}

.page-header {
  text-align: center;
  margin-bottom: 1.2rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  font-weight: 700;
}

.page-header h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.35rem;
}

.page-header p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.8rem;
}

.empty-state h3 {
  font-size: 1.35rem;
  margin: 0 0 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.compare-shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.compare-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.85rem;
}

.bike-card {
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  padding: 0.9rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.bike-card-top {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 0.7rem;
}

.bike-thumb {
  width: 88px;
  height: 70px;
  object-fit: cover;
  border-radius: 14px;
  background: #f8fafc;
}

.bike-meta h2 {
  margin: 0.1rem 0 0.2rem;
  font-size: 0.98rem;
  color: var(--text-primary);
}

.bike-brand {
  margin: 0;
  font-size: 0.8rem;
  color: var(--accent-color);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.bike-price {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.remove-btn {
  border: none;
  background: rgba(255, 107, 53, 0.12);
  color: var(--accent-color);
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.table-card {
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
  padding: 0.6rem;
}

.comparison-table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.comparison-table {
  width: 100%;
  min-width: 720px;
  border-collapse: separate;
  border-spacing: 0;
}

.comparison-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #111827;
  color: white;
  padding: 0.85rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.spec-label-head {
  min-width: 180px;
  background: #111827;
  left: 0;
  z-index: 3;
}

.bike-head {
  min-width: 180px;
  vertical-align: top;
}

.bike-head-inner {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.bike-head .bike-name {
  font-size: 0.92rem;
  font-weight: 700;
}

.bike-head .bike-brand {
  color: #d1d5db;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.bike-head .bike-price {
  color: #ffb089;
  font-size: 0.9rem;
}

.comparison-table tbody th,
.comparison-table tbody td {
  padding: 0.8rem 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  vertical-align: middle;
}

.comparison-table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
  background: #f8fafc;
  color: var(--text-primary);
  font-weight: 700;
  text-align: left;
  min-width: 180px;
}

.value-cell {
  color: var(--text-secondary);
  white-space: nowrap;
}

.value-cell.best-value {
  background: rgba(255, 107, 53, 0.08);
  color: var(--text-primary);
}

.value-text {
  display: inline-flex;
  align-items: center;
}

.trophy-badge {
  margin-left: 0.45rem;
  font-size: 0.86rem;
}

.comparison-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding-top: 0.25rem;
}

.btn-primary,
.btn-secondary,
.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  padding: 0.8rem 1rem;
  transition: all 0.25s ease;
}

.btn-primary,
.btn-cta {
  background: var(--primary-color);
  color: white;
}

.btn-secondary {
  background: #f8fafc;
  color: var(--text-primary);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-cta:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .compare-page {
    padding: 1.25rem 0 3rem;
  }

  .compare-cards {
    grid-template-columns: 1fr;
  }

  .comparison-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .table-card {
    padding: 0.45rem;
  }
}
</style>
