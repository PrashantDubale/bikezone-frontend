<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="container-custom">
        <div class="hero-content">
          <div class="hero-copy">
            <p class="eyebrow">Premium motorcycle marketplace</p>
            <h1>Ride with clarity, compare with confidence.</h1>
            <p class="hero-text">
              Discover refined machines, compare the right specs, and find the bike that fits your lifestyle in one polished experience.
            </p>

            <div class="hero-actions">
              <router-link to="/bikes" class="btn-primary">Explore Bikes</router-link>
              <router-link to="/compare" class="btn-secondary">Compare Now</router-link>
            </div>

            <div class="hero-highlights">
              <span class="highlight-pill">Price focused </span>/
              <span class="highlight-pill">Power packed </span>/
              <span class="highlight-pill">Mileage smart</span>
            </div>
          </div>

          <div class="hero-visual" v-if="heroFeaturedBike">
            <div class="hero-card">
              <div class="hero-card-image">
                <img
                  v-if="heroFeaturedBike?.image"
                  :src="heroFeaturedBike.image"
                  :alt="heroFeaturedBike.name"
                  class="hero-bike-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="hero-card-body">
                <p class="hero-card-kicker">Featured pick</p>
                <h3>{{ heroFeaturedBike?.name }}</h3>
                <p class="hero-card-brand">{{ heroFeaturedBike?.brand }}</p>
                <div class="hero-card-stats">
                  <div>
                    <span>Engine</span>
                    <strong>{{ heroFeaturedBike?.specs?.engine_cc ?? heroFeaturedBike?.engine_cc ?? '—' }}cc</strong>
                  </div>
                  <div>
                    <span>Power</span>
                    <strong>{{ heroFeaturedBike?.specs?.power ?? heroFeaturedBike?.horsepower ?? '—' }}bhp</strong>
                  </div>
                  <div>
                    <span>Mileage</span>
                    <strong>{{ heroFeaturedBike?.specs?.mileage ?? heroFeaturedBike?.mileage ?? '—' }}km/l</strong>
                  </div>
                </div>
                <router-link :to="`/bikes/${heroFeaturedBike?.id}`" class="hero-card-link">
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="search-section">
      <div class="container-custom">
        <div class="search-shell">
          <div class="search-copy">
            <p class="eyebrow">Fast discovery</p>
            <h2>Find the right ride in seconds</h2>
          </div>
          <div class="search-bar-container">
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search by bike name or brand..."
              class="search-bar"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">Search</button>
          </div>
          <div class="chip-row">
            <button v-for="brand in popularBrands" :key="brand" class="brand-chip" @click="searchBrand(brand)">
              {{ brand }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="container-custom">
        <div class="section-header">
          <div>
            <p class="eyebrow">Showcase</p>
            <h2>Featured motorcycles</h2>
          </div>
          <router-link to="/bikes" class="view-all">View all →</router-link>
        </div>
        <div class="bikes-grid">
          <BikeCard v-for="bike in (bikeStore.featured || []).slice(0, 6)" :key="bike.id" :bike="bike" />
        </div>
      </div>
    </section>

    <section class="benefits-section">
      <div class="container-custom">
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Modern discovery</h3>
            <p>Explore bikes with a clear hierarchy built around price, engine, power, and mileage.</p>
          </div>
          <div class="benefit-card">
            <h3>Side-by-side comparison</h3>
            <p>Stack your top choices and decide faster without digging through long specs.</p>
          </div>
          <div class="benefit-card">
            <h3>Rider-first reviews</h3>
            <p>See what owners value most, from everyday comfort to peak performance.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews-section">
      <div class="container-custom">
        <div class="section-header">
          <div>
            <p class="eyebrow">Community voice</p>
            <h2>Latest reviews</h2>
          </div>
          <router-link to="/reviews" class="view-all">View all →</router-link>
        </div>
        <div class="reviews-grid">
          <div class="review-card" v-for="review in sampleReviews" :key="review.id">
            <div class="review-header">
              <p class="review-title">{{ review.title }}</p>
              <div class="review-rating">
                <span class="stars">⭐ {{ review.rating }}</span>
              </div>
            </div>
            <p class="review-bike">{{ review.bike }}</p>
            <p class="review-text">{{ review.comment }}</p>
            <p class="review-author">— {{ review.user }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container-custom">
        <div class="cta-content">
          <div>
            <p class="eyebrow">Next step</p>
            <h2>Compare up to four bikes at once</h2>
            <p>Make an informed decision with a cleaner comparison experience and clearer specs.</p>
          </div>
          <router-link to="/bikes" class="btn-cta">Start comparing</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBikeStore } from '../stores/bikeStore'
import { useRouter } from 'vue-router'
import BikeCard from '../components/BikeCard.vue'

const bikeStore = useBikeStore()
const router = useRouter()
const searchInput = ref('')

const heroFeaturedBike = computed(() => {
  return (bikeStore.featured && bikeStore.featured[0]) || (bikeStore.bikes && bikeStore.bikes[0]) || null
})

const popularBrands = ref([
  'Royal Enfield',
  'Honda',
  'Yamaha',
  'KTM',
  'TVS',
  'Bajaj',
  'Hero',
  'Suzuki'
])

const sampleReviews = ref([
  {
    id: 1,
    title: 'Great commuter bike',
    rating: 4.5,
    bike: 'Royal Enfield Classic 350',
    comment: 'Comfortable for daily commute, excellent mileage and fuel efficiency.',
    user: 'John Doe'
  },
  {
    id: 2,
    title: 'Performance beast',
    rating: 5,
    bike: 'KTM 390 Duke',
    comment: 'Fantastic power delivery, responsive handling, perfect for weekend rides.',
    user: 'Jane Smith'
  },
  {
    id: 3,
    title: 'Value for money',
    rating: 4,
    bike: 'Honda CB Shine',
    comment: 'Reliable, good mileage, perfect for Indian roads.',
    user: 'Mike Johnson'
  },
  {
    id: 4,
    title: 'Smooth cruiser',
    rating: 4.5,
    bike: 'Yamaha FZ-X',
    comment: 'Smooth engine, good ground clearance, versatile bike for all terrains.',
    user: 'Sarah Williams'
  }
])

const handleSearch = () => {
  if (searchInput.value) {
    bikeStore.searchQuery = searchInput.value
    router.push('/bikes')
  }
}

const searchBrand = (brand) => {
  bikeStore.selectedBrand = brand
  bikeStore.searchQuery = ''
  router.push('/bikes')
}

const formatPrice = (price) => {
  return (price / 100000).toFixed(2)
}
</script>

<style scoped>
.home-page {
  width: 100%;
}

.hero-section {
  background: linear-gradient(135deg, #111827 0%, #1f2937 45%, #4f46e5 100%);
  color: white;
  padding: 2.5rem 0 3rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 107, 53, 0.22) 0%, transparent 36%);
  pointer-events: none;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 0.8rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-copy h1 {
  font-size: clamp(2.1rem, 4vw, 3.2rem);
  line-height: 1.05;
  margin: 0.2rem 0 0.7rem;
  font-weight: 800;
}

.eyebrow {
  margin: 0;
  color: #ffb089;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.78rem;
  font-weight: 700;
}

.hero-text {
  font-size: 1.05rem;
  color: #e5e7eb;
  max-width: 56ch;
  line-height: 1.7;
  margin: 0 0 0.9rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 0.7rem;
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
  transition: all 0.25s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), #ff7a3d);
  color: white;
  padding: 0.9rem 1.2rem;
}

.btn-secondary {
  color: white;
  padding: 0.9rem 1.2rem;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-cta:hover {
  transform: translateY(-2px);
}

.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.highlight-pill {
  font-weight: 700;
  font-style: italic;
  font-size: 1rem;
  color: #f3f4f6;
}

.hero-card {
  background: rgba(255,255,255,0.96);
  color: var(--text-primary);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25);
}

.hero-card-image {
  background: linear-gradient(135deg, #4f46e5 0%, #ff6b35 100%);
  padding: 1rem;
}

.hero-bike-image {
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  display: block;
}

.hero-card-body {
  padding: 1rem 1.1rem 1.2rem;
}

.hero-card-kicker {
  margin: 0 0 0.35rem;
  color: var(--accent-color);
  font-size: 0.92rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.hero-card h3 {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
}

.hero-card-brand {
  margin: 0.3rem 0 1.1rem;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 1.1rem;
}

.hero-card-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.hero-card-stats div {
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.85rem 0.7rem;
}

.hero-card-stats span {
  display: block;
  font-size: 0.82rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.hero-card-stats strong {
  display: block;
  margin-top: 0.3rem;
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 800;
}

.hero-card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.02rem;
}

.search-section {
  padding: 1.6rem 0 1.4rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f2f5f9 100%);
}

.search-shell {
  background: white;
  border-radius: 24px;
  padding: 1rem;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
}

.search-copy h2 {
  margin: 0.2rem 0 0.8rem;
  font-size: 1.35rem;
}

.search-bar-container {
  display: flex;
  gap: 0.75rem;
  max-width: 720px;
  margin-bottom: 0.9rem;
}

.search-bar {
  flex: 1;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 0.95rem;
  font-family: inherit;
}

.search-btn {
  border: none;
  border-radius: 999px;
  background: var(--primary-color);
  color: white;
  padding: 0.9rem 1.1rem;
  font-weight: 700;
  cursor: pointer;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.brand-chip {
  border: 1px solid rgba(79, 70, 229, 0.16);
  background: #f8fafc;
  color: var(--text-primary);
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.featured-section,
.reviews-section {
  padding: 1.5rem 0 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 0.7rem;
}

.section-header h2 {
  margin: 0.2rem 0 0;
  font-size: 1.45rem;
}

.view-all {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 700;
}

.bikes-grid,
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.8rem;
}

.benefits-section {
  padding: 1.4rem 0 0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.benefit-card,
.review-card,
.cta-content {
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
}

.benefit-card {
  padding: 1.1rem;
}

.benefit-card h3 {
  margin: 0 0 0.45rem;
  font-size: 1.05rem;
}

.benefit-card p,
.review-text,
.cta-content p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.review-card {
  padding: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.55rem;
}

.review-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.review-rating {
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 700;
}

.review-bike {
  margin: 0 0 0.35rem;
  color: var(--primary-color);
  font-weight: 700;
}

.review-author {
  margin-top: 0.7rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.cta-section {
  padding: 1.6rem 0 2rem;
}

.cta-content {
  padding: 1.2rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.cta-content h2 {
  margin: 0.2rem 0 0.3rem;
  font-size: 1.3rem;
}

.btn-cta {
  background: var(--primary-color);
  color: white;
  padding: 0.85rem 1.1rem;
}

@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1.8rem 0 2.2rem;
  }

  .hero-actions,
  .section-header,
  .cta-content,
  .search-bar-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar-container {
    gap: 0.6rem;
  }

  .hero-card-stats {
    grid-template-columns: 1fr;
  }

  .cta-content {
    align-items: flex-start;
  }
}
</style>  