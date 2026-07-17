<template>
  <div class="filter-panel glass">
    <div class="filter-container">
      <div class="filter-section">
        <h4 class="section-title">Search</h4>
        <input
          v-model="bikeStore.searchQuery"
          type="text"
          placeholder="Bike name, brand..."
          class="search-input"
        />
      </div>

      <div class="filter-section">
        <h4 class="section-title">Category</h4>
        <div class="chip-group">
          <button type="button" class="filter-chip" :class="{ active: !bikeStore.selectedCategory }" @click="bikeStore.selectedCategory = ''">
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="filter-chip"
            :class="{ active: bikeStore.selectedCategory === cat }"
            @click="bikeStore.selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <h4 class="section-title">Brand</h4>
        <div class="chip-group">
          <button type="button" class="filter-chip" :class="{ active: !bikeStore.selectedBrand }" @click="bikeStore.selectedBrand = ''">
            All
          </button>
          <button
            v-for="brand in bikeStore.brands"
            :key="brand"
            type="button"
            class="filter-chip"
            :class="{ active: bikeStore.selectedBrand === brand }"
            @click="bikeStore.selectedBrand = brand"
          >
            {{ brand }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <h4 class="section-title">Price Range (₹)</h4>
        <div class="price-range">
          <input
            type="range"
            min="0"
            max="2500000"
            step="50000"
            v-model.number="bikeStore.priceRange[0]"
            class="range-slider"
          />
          <input
            type="range"
            min="0"
            max="2500000"
            step="50000"
            v-model.number="bikeStore.priceRange[1]"
            class="range-slider"
          />
          <div class="price-display">
            <span>₹{{ formatPrice(bikeStore.priceRange[0]) }}</span>
            <span>₹{{ formatPrice(bikeStore.priceRange[1]) }}</span>
          </div>
        </div>
      </div>

      <button class="btn-reset" @click="resetFilters">
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBikeStore } from '../stores/bikeStore'

const bikeStore = useBikeStore()

const categories = ref([
  'Cruiser',
  'Sport',
  'Adventure',
  'Naked',
  'Touring',
  'Retro'
])

const formatPrice = (price) => {
  return (price / 100000).toFixed(2)
}

const resetFilters = () => {
  bikeStore.searchQuery = ''
  bikeStore.selectedBrand = ''
  bikeStore.selectedCategory = ''
  bikeStore.priceRange = [0, 2500000]
}
</script>

<style scoped>
.filter-panel {
  padding: 1.3rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.filter-chip {
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: #f8fafc;
  color: var(--text-primary);
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-chip.active {
  background: linear-gradient(135deg, var(--primary-color), #4338ca);
  color: white;
  border-color: transparent;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.range-slider {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  background: var(--accent-color);
  transform: scale(1.08);
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.range-slider::-moz-range-thumb:hover {
  background: var(--accent-color);
  transform: scale(1.08);
}

.price-display {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: var(--primary-color);
  font-size: 0.9rem;
}

.btn-reset {
  width: 100%;
  padding: 0.75rem;
  background: var(--text-primary);
  color: white;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}
</style>
