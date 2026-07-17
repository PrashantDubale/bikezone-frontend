<template>
  <div class="bike-card slide-in-up">
    <div class="card-image-container">
      <img :src="bike.image" :alt="bike.name" class="card-image" loading="lazy" decoding="async" />
      <div class="image-overlay"></div>
      <span class="bike-category">{{ bike.category }}</span>
      <span v-if="bike.is_new" class="new-badge">New Arrival</span>
      <button class="favorite-btn" @click="toggleFavorite">
        <span v-if="!isFavorited">🤍</span>
        <span v-else>❤️</span>
      </button>
    </div>

    <div class="card-content">
      <div class="card-header">
        <div>
          <p class="bike-brand">{{ bike.brand }}</p>
          <h3 class="bike-name">{{ bike.name }}</h3>
        </div>
      </div>

      <div class="specs-row">
        <div class="spec-item">
          <span class="spec-label">Engine</span>
          <span class="spec-value">{{ getSpecValue('engine_cc', 'engine_cc') }}cc</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Power</span>
          <span class="spec-value">{{ getSpecValue('horsepower', 'power', ' hp') }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Mileage</span>
          <span class="spec-value">{{ getSpecValue('mileage', 'mileage', ' km/l') }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Top Speed</span>
          <span class="spec-value">{{ getSpecValue('top_speed', 'top_speed', ' km/h') }}</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="price-section">
          <p class="price-label">Starting from</p>
          <p class="price">₹{{ formatPrice(bike.price) }}</p>
        </div>

        <div class="action-buttons">
          <router-link :to="`/bikes/${bike.id}`" class="btn btn-primary">
            View Details
          </router-link>
          <button class="btn btn-outline" @click="handleCompare">
            Compare
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBikeStore } from '../stores/bikeStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  bike: {
    type: Object,
    required: true
  }
})

const isFavorited = ref(false)
const bikeStore = useBikeStore()
const router = useRouter()

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
}

const handleCompare = () => {
  bikeStore.addToCompare(props.bike)
  if (bikeStore.compareCart.length > 0) {
    router.push('/compare')
  }
}

const getSpecValue = (key, fallbackKey = key, suffix = '') => {
  const value = props.bike.specs?.[key] ?? props.bike[fallbackKey] ?? props.bike[key]
  return value ? `${value}${suffix}` : '—'
}

const formatPrice = (price) => {
  return (price / 100000).toFixed(2)
}
</script>

<style scoped>
.bike-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.bike-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, #4f46e5 0%, #ff6b35 100%);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.06) 0%, rgba(2, 6, 23, 0.24) 100%);
}

.bike-card:hover .card-image {
  transform: scale(1.04);
}

.bike-category {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  background: rgba(255, 255, 255, 0.92);
  color: var(--primary-color);
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 2;
}

.new-badge {
  position: absolute;
  top: 2.55rem;
  left: 0.8rem;
  background: linear-gradient(135deg, var(--accent-color), #ff7b3d);
  color: white;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.35);
  z-index: 2;
}

.favorite-btn {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14);
  z-index: 2;
}

.favorite-btn:hover {
  transform: scale(1.08);
  background-color: white;
}

.card-content {
  padding: 1rem 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}

.bike-brand {
  font-size: 0.8rem;
  color: var(--accent-color);
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.bike-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.25rem 0 0;
  line-height: 1.2;
}

.specs-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  margin-bottom: 0.9rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--border-color);
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.16rem;
}

.spec-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.spec-value {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: auto;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.price-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent-color);
  margin: 0;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.btn {
  padding: 0.7rem 0.9rem;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #4338ca);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid rgba(79, 70, 229, 0.24);
}

.btn-outline:hover {
  background-color: rgba(79, 70, 229, 0.06);
  transform: translateY(-2px);
}
</style>