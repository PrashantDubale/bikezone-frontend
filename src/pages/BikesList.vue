<template>
  <div class="bikes-list-page">
    <div class="container-custom">
      <div class="page-header">
        <div class="header-copy">
          <p class="eyebrow">BikeZone Marketplace</p>
          <h1>Browse Motorcycles</h1>
          <p>Explore premium rides, compare specs, and find the perfect machine for every journey.</p>
        </div>

        <div class="header-meta">
          <div class="results-pill">{{ bikeStore.filterBikes.length }} bikes found</div>

          <div class="sort-control" ref="sortControlRef">
            <button type="button" class="sort-trigger" @click="sortMenuOpen = !sortMenuOpen">
              <span class="sort-trigger-label">Sort by</span>
              <span class="sort-trigger-value">{{ sortLabel }}</span>
              <svg class="sort-chevron" :class="{ open: sortMenuOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <Transition name="sort-menu">
              <ul v-if="sortMenuOpen" class="sort-menu">
                <li v-for="option in sortOptions" :key="option.value">
                  <button
                    type="button"
                    class="sort-option"
                    :class="{ active: sortBy === option.value }"
                    @click="selectSort(option.value)"
                  >
                    {{ option.label }}
                    <svg v-if="sortBy === option.value" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </li>
              </ul>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Mobile / tablet filter toggle -->
      <button
        type="button"
        class="mobile-filter-toggle"
        @click="mobileFiltersOpen = true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Filters
      </button>

      <div class="content-wrapper">
        <aside class="sidebar" :class="{ 'sidebar-open': mobileFiltersOpen }">
          <div class="sidebar-mobile-header">
            <span>Filters</span>
            <button type="button" class="sidebar-close" @click="mobileFiltersOpen = false" aria-label="Close filters">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <FilterPanel />
        </aside>

        <!-- Backdrop for mobile filter drawer -->
        <div
          v-if="mobileFiltersOpen"
          class="sidebar-backdrop"
          @click="mobileFiltersOpen = false"
        ></div>

        <main class="bikes-container">
          <div v-if="bikeStore.loading" class="loading">
            Loading bikes...
          </div>

          <div v-else-if="bikeStore.filterBikes.length === 0" class="no-results">
            <p>🏍️</p>
            <h3>No bikes found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>

          <div v-else class="bikes-grid">
            <BikeCard
              v-for="bike in sortedBikes"
              :key="bike.id"
              :bike="bike"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useBikeStore } from '../stores/bikeStore'
import BikeCard from '../components/BikeCard.vue'
import FilterPanel from '../components/FilterPanel.vue'

const bikeStore = useBikeStore()
const sortBy = ref('price')
const sortMenuOpen = ref(false)
const sortControlRef = ref(null)
const mobileFiltersOpen = ref(false)

const sortOptions = [
  { value: 'price', label: 'Price' },
  { value: 'power', label: 'Power' },
  { value: 'mileage', label: 'Mileage' },
  { value: 'topSpeed', label: 'Top Speed' }
]

const sortLabel = computed(() => sortOptions.find((o) => o.value === sortBy.value)?.label || 'Price')

const selectSort = (value) => {
  sortBy.value = value
  sortMenuOpen.value = false
}

const handleClickOutside = (event) => {
  if (sortControlRef.value && !sortControlRef.value.contains(event.target)) {
    sortMenuOpen.value = false
  }
}

// Prevent background scroll when mobile filter drawer is open
watch(mobileFiltersOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})

const sortedBikes = computed(() => {
  const items = [...bikeStore.filterBikes]

  const getValue = (bike, key) => {
    return bike[key] ?? bike.specs?.[key] ?? 0
  }

  items.sort((a, b) => {
    switch (sortBy.value) {
      case 'power':
        return (getValue(b, 'horsepower') || getValue(b, 'power')) - (getValue(a, 'horsepower') || getValue(a, 'power'))
      case 'mileage':
        return (getValue(b, 'mileage')) - (getValue(a, 'mileage'))
      case 'topSpeed':
        return (getValue(b, 'top_speed')) - (getValue(a, 'top_speed'))
      case 'price':
      default:
        return a.price - b.price
    }
  })

  return items
})
</script>

<style scoped>
.bikes-list-page {
  padding: 2.5rem 0 3.5rem;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
}

.container-custom {
  width: 100%;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem 1.35rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(255, 107, 53, 0.08));
  border: 1px solid rgba(79, 70, 229, 0.12);
  flex-wrap: wrap;
}

.header-copy h1 {
  font-size: clamp(1.5rem, 3.5vw, 2.15rem);
  font-weight: 800;
  margin: 0.2rem 0 0.4rem;
  color: var(--text-primary);
}

.eyebrow {
  margin: 0;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  font-weight: 700;
}

.header-copy p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.98rem;
  max-width: 58ch;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.results-pill {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 999px;
  padding: 0.6rem 0.9rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

/* ---------- Custom sort dropdown ---------- */
.sort-control {
  position: relative;
}

.sort-trigger {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sort-trigger:hover {
  border-color: rgba(79, 70, 229, 0.35);
}

.sort-trigger-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.sort-trigger-value {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.9rem;
}

.sort-chevron {
  color: var(--primary-color);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.sort-chevron.open {
  transform: rotate(180deg);
}

.sort-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 190px;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
  padding: 0.4rem;
  list-style: none;
  margin: 0;
  z-index: 50;
}

.sort-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  background: none;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
}

.sort-option:hover {
  background: rgba(79, 70, 229, 0.08);
}

.sort-option.active {
  background: linear-gradient(135deg, var(--primary-color), #4338ca);
  color: white;
  font-weight: 700;
}

.sort-menu-enter-active,
.sort-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.sort-menu-enter-from,
.sort-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- Mobile filter toggle (hidden on desktop) ---------- */
.mobile-filter-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.sidebar-mobile-header {
  display: none;
}

.sidebar-backdrop {
  display: none;
}

/* ---------- Layout ---------- */
.content-wrapper {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 1.5rem;
}

.sidebar {
  position: sticky;
  top: 100px;
  align-self: start;
}

.bikes-container {
  min-height: 400px;
}

.bikes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.25rem;
}

.loading,
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.no-results p:first-child {
  font-size: 4rem;
  margin: 0 0 1rem 0;
}

.no-results h3 {
  font-size: 1.4rem;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.no-results p:last-child {
  margin: 0;
}

/* ================= RESPONSIVE BREAKPOINTS ================= */

/* ---------- Small laptops / large tablets landscape ---------- */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 260px 1fr;
    gap: 1.25rem;
  }

  .bikes-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

/* ---------- Tablets (portrait) ---------- */
@media (max-width: 1024px) {
  .mobile-filter-toggle {
    display: flex;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: min(320px, 85vw);
    max-height: none;
    margin: 0;
    background: #fff;
    z-index: 200;
    padding: 1.25rem;
    border-radius: 0;
    box-shadow: -12px 0 40px rgba(15, 23, 42, 0.18);
    transition: right 0.28s ease;
    overflow-y: auto;
  }

  .sidebar-open {
    right: 0;
  }

  .sidebar-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 800;
    font-size: 1.1rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  }

  .sidebar-close {
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

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 150;
  }

  .bikes-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

/* ---------- Large phones / small tablets ---------- */
@media (max-width: 768px) {
  .bikes-list-page {
    padding: 1.5rem 0 2.5rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.85rem;
  }

  .header-meta {
    justify-content: space-between;
    width: 100%;
  }

  .sort-control {
    flex: 1;
  }

  .sort-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .sort-menu {
    left: 0;
    right: 0;
    width: 100%;
  }

  .bikes-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}

/* ---------- Phones ---------- */
@media (max-width: 480px) {
  .container-custom {
    padding-inline: 0.85rem;
  }

  .header-copy h1 {
    font-size: 1.5rem;
  }

  .header-copy p {
    font-size: 0.88rem;
  }

  .results-pill {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }

  .sidebar {
    width: 100vw;
  }

  .bikes-grid {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .loading,
  .no-results {
    padding: 2.5rem 1.25rem;
  }
}
</style>