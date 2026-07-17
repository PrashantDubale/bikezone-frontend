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

      <div class="content-wrapper">
        <aside class="sidebar">
          <FilterPanel />
        </aside>

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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useBikeStore } from '../stores/bikeStore'
import BikeCard from '../components/BikeCard.vue'
import FilterPanel from '../components/FilterPanel.vue'

const bikeStore = useBikeStore()
const sortBy = ref('price')
const sortMenuOpen = ref(false)
const sortControlRef = ref(null)

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

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

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
}

.header-copy h1 {
  font-size: 2.15rem;
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

.content-wrapper {
  display: grid;
  grid-template-columns: 290px 1fr;
  gap: 1.5rem;
}

.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
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

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: start;
  }

  .header-copy h1 {
    font-size: 1.8rem;
  }

  .bikes-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .sort-menu {
    left: 0;
    right: auto;
  }
}
</style>