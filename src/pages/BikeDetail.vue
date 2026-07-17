<template>
  <div class="bike-detail-page">
    <div class="container-custom">
      <div v-if="bike" class="detail-content">
        <router-link to="/bikes" class="back-link">← Explore Bikes</router-link>

        <section class="hero-card">
          <div class="hero-media">
            <div class="main-image-frame">
              <transition name="fade" mode="out-in">
                <img :key="activeImageIndex" :src="displayImage" :alt="bike.name" class="main-image" loading="lazy" decoding="async" />
              </transition>
            </div>
            <div v-if="galleryImages.length > 1" class="thumbnail-row">
              <button
                v-for="(image, index) in galleryImages"
                :key="index"
                type="button"
                class="thumb-btn"
                :class="{ active: index === activeImageIndex }"
                @click="selectImage(index)"
              >
                <img :src="image" :alt="`${bike.name} view ${index + 1}`" loading="lazy" decoding="async" />
              </button>
            </div>
          </div>

          <div class="hero-info">
            <div class="eyebrow-row">
              <span class="brand-pill">{{ bike.brand }}</span>
              <span class="category-pill">{{ bike.category }}</span>
            </div>

            <h1 class="bike-title">{{ bike.name }}</h1>
            <p class="bike-intro">
              Premium performance with a commanding stance, refined comfort, and standout road presence.
            </p>

            <div class="price-block">
              <div>
                <p class="price-label">Starting at</p>
                <p class="price">₹{{ formatPrice(bike.price) }}</p>
              </div>
            </div>

            <div class="spec-pill-grid">
              <div class="spec-pill">
                <span>Engine</span>
                <strong>{{ bike.engine_cc }}cc</strong>
              </div>
              <div class="spec-pill">
                <span>Horsepower</span>
                <strong>{{ bike.horsepower }} hp</strong>
              </div>
              <div class="spec-pill">
                <span>Torque</span>
                <strong>{{ bike.torque }} Nm</strong>
              </div>
              <div class="spec-pill">
                <span>Mileage</span>
                <strong>{{ bike.mileage }} km/l</strong>
              </div>
            </div>

            <div class="action-row">
              <button class="btn btn-primary" @click="addToCompare">Compare Bike</button>
              <button class="btn btn-secondary" @click="toggleWishlist">{{ wishlistActive ? '✓ Saved' : 'Add to Wishlist' }}</button>
              <button class="btn btn-ghost" @click="shareDialogOpen = true">Share</button>
            </div>
          </div>
        </section>

        <section class="specs-section">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Performance & Engineering</p>
              <h2>Technical Specification</h2>
            </div>
            <p class="section-copy">Everything you need to understand what makes this machine stand out.</p>
          </div>

          <div class="overview-grid">
            <div class="overview-card accent-card">
              <p class="overview-label">Engine</p>
              <p class="overview-value">{{ bike.engine_cc }}cc</p>
            </div>
            <div class="overview-card">
              <p class="overview-label">Power</p>
              <p class="overview-value">{{ bike.horsepower }} hp</p>
            </div>
            <div class="overview-card">
              <p class="overview-label">Mileage</p>
              <p class="overview-value">{{ bike.mileage }} km/l</p>
            </div>
            <div class="overview-card">
              <p class="overview-label">Top Speed</p>
              <p class="overview-value">{{ bike.top_speed }} km/h</p>
            </div>
          </div>

          <div class="spec-panels">
            <div v-for="panel in specPanels" :key="panel.title" class="spec-panel">
              <h3>{{ panel.title }}</h3>
              <div class="spec-list">
                <div v-for="item in panel.items" :key="item.label" class="spec-item">
                  <span class="spec-key">{{ item.label }}</span>
                  <span class="spec-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="similar-section">
          <div class="section-heading compact">
            <div>
              <p class="section-kicker">Explore more</p>
              <h2>Similar bikes</h2>
            </div>
          </div>
          <div class="similar-grid">
            <router-link v-for="item in similarBikes" :key="item.id" :to="`/bikes/${item.id}`" class="similar-card">
              <img :src="item.image" :alt="item.name" />
              <div>
                <h3>{{ item.name }}</h3>
                <p>{{ item.brand }}</p>
                <strong>₹{{ formatPrice(item.price) }}</strong>
              </div>
            </router-link>
          </div>
        </section>

        <section class="reviews-section">
          <div class="section-heading compact">
            <div>
              <p class="section-kicker">Owner Feedback</p>
              <h2>Rider Reviews</h2>
            </div>
          </div>

          <div class="reviews-list">
            <div class="review-item" v-for="review in bikeReviews" :key="review.id">
              <div class="review-header-info">
                <h4 class="review-title">{{ review.title }}</h4>
                <span class="review-rating">⭐ {{ review.rating }}/5</span>
              </div>
              <p class="review-user">by {{ review.user }}</p>

              <div v-if="review.pros" class="pros-cons">
                <div class="pros">
                  <h5>Pros</h5>
                  <ul>
                    <li v-for="(pro, idx) in review.pros" :key="idx">✓ {{ pro }}</li>
                  </ul>
                </div>
                <div class="cons">
                  <h5>Cons</h5>
                  <ul>
                    <li v-for="(con, idx) in review.cons" :key="idx">✗ {{ con }}</li>
                  </ul>
                </div>
              </div>

              <p class="review-comment">{{ review.comment }}</p>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="loading">
        <p>Loading bike details...</p>
      </div>
    </div>

    <q-dialog v-model="shareDialogOpen" transition-show="jump-up" transition-hide="jump-down">
      <q-card class="share-dialog-card">
        <q-card-section class="share-dialog-header">
          <div>
            <p class="dialog-kicker" style="color: #64748b; padding-left: 90px;">Share this ride</p>
            <h3 style="color: #64748b; padding-left: 80px;">Send this motorcycle to a fellow rider</h3>
          </div>
          <q-btn flat round icon="close" @click="shareDialogOpen = false" />
        </q-card-section>

        <q-card-section>
          <p class="share-copy" style="color: #64748b; padding-left: 90px;">Share a quick look at {{ bike?.brand }} {{ bike?.name }} with your riding circle.</p>
          <q-input v-model="shareLink" outlined dense readonly class="share-input" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useBikeStore } from '../stores/bikeStore'

const route = useRoute()
const router = useRouter()
const bikeStore = useBikeStore()

const bike = computed(() => {
  return bikeStore.bikes.find(b => b.id === route.params.id)
})

const activeImageIndex = ref(0)
const wishlistActive = ref(false)
const shareDialogOpen = ref(false)
const shareLink = ref('')

const galleryImages = computed(() => {
  if (!bike.value) return []
  const rawImages = Array.isArray(bike.value.images) ? bike.value.images : []
  const sanitized = rawImages.filter(image => typeof image === 'string' && image.trim())
  if (sanitized.length) return sanitized
  return bike.value.image ? [bike.value.image] : []
})

const displayImage = computed(() => {
  return galleryImages.value[activeImageIndex.value] || bike.value?.image || ''
})

const selectImage = (index) => {
  activeImageIndex.value = index
}

const toggleWishlist = () => {
  wishlistActive.value = !wishlistActive.value
}

const similarBikes = computed(() => {
  if (!bike.value) return []
  return bikeStore.bikes.filter(item => {
    if (item.id === bike.value.id) return false
    return item.category === bike.value.category || item.brand === bike.value.brand
  }).slice(0, 3)
})

const keyStats = computed(() => {
  if (!bike.value) return []

  return [
    { label: 'Engine', value: `${bike.value.engine_cc}cc`, icon: '⚙️' },
    { label: 'Power', value: `${bike.value.horsepower}hp`, icon: '⚡' },
    { label: 'Mileage', value: `${bike.value.mileage}km/l`, icon: '⛽' },
    { label: 'Top Speed', value: `${bike.value.top_speed}km/h`, icon: '🚀' }
  ]
})

const specPanels = computed(() => {
  if (!bike.value) return []

  return [
    {
      title: 'Performance',
      items: [
        { label: 'Power RPM', value: bike.value.power_rpm },
        { label: 'Torque', value: `${bike.value.torque} Nm` },
        { label: 'Torque RPM', value: bike.value.torque_rpm },
        { label: 'Cooling', value: bike.value.cooling_system }
      ]
    },
    {
      title: 'Dimensions & Weight',
      items: [
        { label: 'Kerb Weight', value: `${bike.value.kerb_weight} kg` },
        { label: 'Seat Height', value: `${bike.value.seat_height} mm` },
        { label: 'Ground Clearance', value: `${bike.value.ground_clearance} mm` },
        { label: 'Wheelbase', value: `${bike.value.wheelbase} mm` }
      ]
    },
    {
      title: 'Tyres & Braking',
      items: [
        { label: 'Front Tyre', value: bike.value.front_tyre },
        { label: 'Rear Tyre', value: bike.value.rear_tyre },
        { label: 'ABS Type', value: bike.value.abs_type },
        { label: 'Gearbox', value: bike.value.gearbox }
      ]
    },
    {
      title: 'Fuel & Ownership',
      items: [
        { label: 'Fuel Tank', value: `${bike.value.fuel_tank} L` },
        { label: 'Fuel Type', value: bike.value.fuel_type },
        { label: 'Launch Year', value: bike.value.launch_year },
        { label: 'Category', value: bike.value.category }
      ]
    }
  ]
})

const bikeReviews = computed(() => {
  return [
    {
      id: 1,
      title: 'Excellent daily commuter',
      rating: 4.5,
      user: 'Rajesh Kumar',
      pros: ['Great mileage', 'Comfortable seat', 'Reliable engine'],
      cons: ['Limited ground clearance', 'Basic features'],
      comment: 'Perfect for city commuting. Very fuel efficient and maintains good speed on highways.'
    },
    {
      id: 2,
      title: 'Value for money bike',
      rating: 4,
      user: 'Priya Sharma',
      pros: ['Affordable', 'Good performance', 'Easy maintenance'],
      cons: ['No ABS option', 'Basic styling'],
      comment: 'Great first bike for enthusiasts. Handles well on Indian roads and offers good value.'
    },
    {
      id: 3,
      title: 'Smooth ride quality',
      rating: 5,
      user: 'Vikram Desai',
      pros: ['Smooth engine', 'Good build quality', 'Responsive handling'],
      cons: ['Expensive spare parts'],
      comment: 'Loving this bike for 2 years now. Never disappointed with performance or reliability.'
    }
  ]
})

const addToCompare = () => {
  bikeStore.addToCompare(bike.value)
  if (bikeStore.compareCart.length > 0) {
    router.push('/compare')
  }
}

const formatPrice = (price) => {
  return (price / 100000).toFixed(2)
}
</script>

<style scoped>
.bike-detail-page {
  padding: 2rem 0 4rem;
  background: linear-gradient(180deg, #f7f8fb 0%, #eef2f6 100%);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: var(--accent-color);
  transform: translateX(-4px);
}

.hero-card {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  background: radial-gradient(circle at top left, #1f2435 0%, #11131b 55%, #090b11 100%);
  color: white;
  border-radius: 28px;
  padding: 1.25rem;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
  overflow: hidden;
  margin-bottom: 2rem;
}

.hero-media {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.16), rgba(15, 23, 42, 0.95));
  border-radius: 24px;
  padding: 0.9rem;
}

.main-image-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 18px;
  background: #111827;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(1.05) contrast(1.02);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.thumbnail-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.thumb-btn {
  padding: 0;
  border: 2px solid transparent;
  border-radius: 14px;
  overflow: hidden;
  background: #111827;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.thumb-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 107, 53, 0.4);
}

.thumb-btn.active {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.16);
}

.thumb-btn img {
  width: 100%;
  height: 72px;
  object-fit: cover;
  display: block;
}

.hero-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 0.35rem 0.2rem;
}

.brand-pill,
.category-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.brand-pill {
  background: rgba(255, 107, 53, 0.16);
  color: #ffb089;
  border: 1px solid rgba(255, 107, 53, 0.32);
}

.category-pill {
  background: rgba(255, 255, 255, 0.09);
  color: #e6e8ef;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.bike-title {
  font-size: clamp(2.25rem, 3.7vw, 3.35rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.05;
}

.bike-intro {
  margin: 0;
  max-width: 58ch;
  color: #c8cdd8;
  font-size: 1.08rem;
  line-height: 1.75;
}

.price-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.price-label {
  font-size: 0.85rem;
  color: #ffb089;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin: 0 0 0.25rem 0;
}

.price {
  font-size: 2.25rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

.btn {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), #ff7b3d);
  color: white;
  padding: 0.8rem 1.1rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(255, 107, 53, 0.25);
}

.btn-secondary,
.btn-ghost {
  background: transparent;
  color: white;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.btn-secondary:hover,
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

.share-dialog-card {
  width: min(480px, 92vw);
  border-radius: 22px;
  background: #0f172a;
  color: white;
}

.share-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.share-copy {
  margin: 0 0 0.8rem 0;
  color: #cbd5e1;
  line-height: 1.6;
}

.share-input {
  margin-top: 0.3rem;
}

.spec-pill-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.spec-pill {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.8rem 0.9rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.spec-pill span {
  font-size: 0.72rem;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.spec-pill strong {
  font-size: 1rem;
  color: white;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.specs-section,
.similar-section,
.reviews-section {
  background: #ffffff;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.06);
  margin-bottom: 1.5rem;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.9rem;
}

.similar-card {
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 0.8rem;
  color: inherit;
}

.similar-card img {
  width: 88px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
}

.similar-card h3 {
  margin: 0 0 0.2rem;
  font-size: 0.98rem;
  color: #111827;
}

.similar-card p {
  margin: 0 0 0.2rem;
  color: #64748b;
  font-size: 0.84rem;
}

.similar-card strong {
  color: var(--accent-color);
  font-size: 0.95rem;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.section-heading.compact {
  margin-bottom: 1rem;
}

.section-kicker {
  margin: 0 0 0.25rem 0;
  font-size: 0.78rem;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
}

.section-heading h2 {
  font-size: 1.6rem;
  margin: 0;
  color: #111827;
}

.section-copy {
  margin: 0;
  color: #64748b;
  max-width: 34ch;
  line-height: 1.7;
  font-size: 1rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.overview-card {
  padding: 1rem;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.accent-card {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.12), rgba(255, 255, 255, 0.9));
  border-color: rgba(255, 107, 53, 0.2);
}

.overview-label {
  margin: 0 0 0.3rem 0;
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.overview-value {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
}

.spec-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.spec-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1rem;
}

.spec-panel h3 {
  margin: 0 0 0.8rem 0;
  font-size: 1.08rem;
  color: #111827;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid #e2e8f0;
}

.spec-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.spec-key {
  font-size: 0.96rem;
  color: #64748b;
}

.spec-value {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  text-align: right;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1rem 1.1rem;
  border-radius: 16px;
}

.review-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.35rem;
}

.review-title {
  margin: 0;
  font-size: 1.08rem;
  color: #111827;
}

.review-rating {
  background: rgba(255, 107, 53, 0.12);
  color: var(--accent-color);
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.review-user {
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
  color: #64748b;
}

.pros-cons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.pros h5,
.cons h5 {
  margin: 0 0 0.4rem 0;
  font-size: 0.9rem;
  color: #111827;
}

.pros ul,
.cons ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pros li,
.cons li {
  font-size: 0.95rem;
  color: #475569;
}

.review-comment {
  margin: 0;
  color: #64748b;
  line-height: 1.75;
  font-size: 1rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

@media (max-width: 900px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .overview-grid,
  .spec-panels {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .bike-detail-page {
    padding: 1rem 0 3rem;
  }

  .price-block,
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .quick-stats,
  .overview-grid,
  .spec-panels,
  .pros-cons {
    grid-template-columns: 1fr;
  }

  .hero-media {
    min-height: 280px;
  }

  .main-image {
    max-height: 280px;
  }

  .dialog-stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-dialog-carousel {
    height: 320px;
  }

  .price {
    font-size: 1.7rem;
  }
}
</style>
