<template>
  <div class="reviews-page">
    <div class="container-custom">
      <div class="page-header">
        <p class="eyebrow">Owner insights</p>
        <h1>Rider reviews</h1>
        <p>Real feedback from riders who rely on these machines every day.</p>
      </div>

      <div class="reviews-stats">
        <div class="stat-card">
          <p class="stat-number">{{ allReviews.length }}</p>
          <p class="stat-label">Total reviews</p>
        </div>
        <div class="stat-card">
          <p class="stat-number">{{ averageRating }}</p>
          <p class="stat-label">Average rating</p>
        </div>
        <div class="stat-card">
          <p class="stat-number">{{ totalBikes }}</p>
          <p class="stat-label">Motorcycles reviewed</p>
        </div>
      </div>

      <div class="reviews-container">
        <div class="reviews-list">
          <div class="review-card" v-for="review in allReviews" :key="review.id">
            <div class="review-card-header">
              <div class="review-title-rating">
                <h3 class="review-title">{{ review.title }}</h3>
                <div class="rating-badge">
                  <span class="stars">⭐</span>
                  <span class="rating-value">{{ review.rating }}/5</span>
                </div>
              </div>
            </div>
            <p class="bike-name">{{ review.bike }}</p>
            <p class="user-name">— {{ review.user }}</p>
            <p class="review-text">{{ review.comment }}</p>
            <div v-if="review.pros || review.cons" class="pros-cons-section">
              <div v-if="review.pros" class="pros">
                <h5>Pros</h5>
                <ul>
                  <li v-for="(pro, idx) in review.pros" :key="idx">✓ {{ pro }}</li>
                </ul>
              </div>
              <div v-if="review.cons" class="cons">
                <h5>Cons</h5>
                <ul>
                  <li v-for="(con, idx) in review.cons" :key="idx">✗ {{ con }}</li>
                </ul>
              </div>
            </div>
            <div class="review-actions">
              <button class="action-btn">👍 Helpful</button>
              <button class="action-btn">💬 Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const allReviews = ref([
  {
    id: 1,
    title: 'Perfect daily commuter',
    rating: 4.5,
    bike: 'Royal Enfield Classic 350',
    user: 'Rajesh Kumar',
    comment: 'This bike is absolutely fantastic for daily commuting. Great fuel efficiency, comfortable riding position, and very reliable. Perfect for Indian roads.',
    pros: ['Excellent mileage', 'Comfortable seat', 'Great resale value', 'Easy maintenance'],
    cons: ['Heavy', 'Limited features']
  },
  {
    id: 2,
    title: 'Best performance bike',
    rating: 5,
    bike: 'KTM 390 Duke',
    user: 'Priya Sharma',
    comment: 'Amazing bike for enthusiasts! Responsive handling, great power delivery, and looks stunning. The ride quality is superb on highways.',
    pros: ['Powerful engine', 'Excellent handling', 'Modern styling', 'Great braking'],
    cons: ['Expensive maintenance', 'Stiff suspension']
  },
  {
    id: 3,
    title: 'Reliable workhorse',
    rating: 4,
    bike: 'Honda CB Shine',
    user: 'Vikram Desai',
    comment: 'Solid bike for everyday use. Very reliable, good fuel efficiency, and easy to maintain. Perfect for budget-conscious riders.',
    pros: ['Reliable', 'Good mileage', 'Affordable', 'Easy spare parts'],
    cons: ['Basic design', 'Modest power']
  },
  {
    id: 4,
    title: 'Smooth and comfortable',
    rating: 4.5,
    bike: 'Yamaha FZ-X',
    user: 'Anjali Menon',
    comment: 'Versatile bike that handles both city and highway riding well. Smooth engine, good ground clearance, and comfortable for long rides.',
    pros: ['Versatile', 'Smooth engine', 'Good ground clearance', 'Comfortable'],
    cons: ['Average power', 'Basic features']
  },
  {
    id: 5,
    title: 'Adventure bike extraordinaire',
    rating: 5,
    bike: 'TVS Apache RTR 200',
    user: 'Sanjay Patel',
    comment: 'Excellent adventure capability with great off-road performance. Comfortable for long distance touring and perfect for exploring new trails.',
    pros: ['Great off-road capability', 'Comfortable for touring', 'Good power', 'Durable'],
    cons: ['Can be expensive to service']
  },
  {
    id: 6,
    title: 'Budget-friendly option',
    rating: 4,
    bike: 'Bajaj Pulsar 150',
    user: 'Mohit Singh',
    comment: 'Great value for money bike. Good performance, reliable engine, and affordable pricing makes it a perfect choice for new riders.',
    pros: ['Affordable', 'Good performance', 'Reliable', 'Easy to ride'],
    cons: ['Average comfort', 'No features']
  },
  {
    id: 7,
    title: 'Premium cruiser feel',
    rating: 4.5,
    bike: 'Triumph Street Twin',
    user: 'Neha Gupta',
    comment: 'Fantastic premium bike with classic styling. Excellent build quality, smooth riding experience, and heads turn everywhere!',
    pros: ['Premium feel', 'Smooth engine', 'Classic design', 'Quality build'],
    cons: ['Expensive', 'High maintenance cost']
  },
  {
    id: 8,
    title: 'Performance king',
    rating: 5,
    bike: 'BMW S1000RR',
    user: 'Ravi Krishnan',
    comment: 'Absolute beast on track! Incredible power delivery, precision handling, and cutting-edge technology. Not for casual riders!',
    pros: ['Tremendous power', 'Precision handling', 'Advanced tech', 'Track capable'],
    cons: ['Expensive', 'Overkill for normal riding']
  }
])

const averageRating = computed(() => {
  const sum = allReviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / allReviews.value.length).toFixed(1)
})

const totalBikes = computed(() => {
  const uniqueBikes = new Set(allReviews.value.map(r => r.bike))
  return uniqueBikes.size
})
</script>

<style scoped>
.reviews-page {
  padding: 2.4rem 0 3.4rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
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
  margin: 0 0 0.5rem;
  color: var(--text-primary);
}

.page-header p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.reviews-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.4rem;
}

.stat-card {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 1.2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.stat-number { font-size: 2rem; font-weight: 800; margin: 0; }
.stat-label { font-size: 0.9rem; margin: 0.25rem 0 0; opacity: 0.95; font-weight: 600; }

.reviews-container {
  background: white;
  border-radius: 24px;
  padding: 1.1rem;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.reviews-list { display: flex; flex-direction: column; gap: 1rem; }
.review-card { padding: 1rem; background: #f8fafc; border-radius: 18px; border-left: 4px solid var(--accent-color); transition: all 0.25s ease; }
.review-card:hover { transform: translateX(4px); box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06); }
.review-card-header { margin-bottom: 0.6rem; }
.review-title-rating { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.review-title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.rating-badge { display: flex; align-items: center; gap: 0.35rem; background: rgba(255,107,53,0.12); color: var(--accent-color); padding: 0.4rem 0.65rem; border-radius: 999px; font-weight: 700; white-space: nowrap; }
.bike-name { font-size: 0.95rem; color: var(--primary-color); font-weight: 700; margin: 0 0 0.2rem; }
.user-name { font-size: 0.85rem; color: var(--text-secondary); font-style: italic; margin: 0 0 0.7rem; }
.review-text { font-size: 0.95rem; color: var(--text-primary); line-height: 1.7; margin: 0; }
.pros-cons-section { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.8rem 0; padding: 0.8rem; background: white; border-radius: 14px; }
.pros h5, .cons h5 { font-size: 0.9rem; font-weight: 700; margin: 0 0 0.4rem; color: var(--text-primary); }
.pros ul { color: #16a34a; }
.cons ul { color: #dc2626; }
.pros ul, .cons ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.35rem; }
.pros li, .cons li { font-size: 0.88rem; }
.review-actions { display: flex; gap: 0.75rem; margin-top: 0.8rem; }
.action-btn { padding: 0.55rem 0.8rem; background: white; color: var(--text-secondary); border: 1px solid rgba(148,163,184,0.2); border-radius: 999px; cursor: pointer; font-weight: 700; font-size: 0.85rem; }
.action-btn:hover { color: var(--primary-color); border-color: var(--primary-color); }
@media (max-width: 768px) { .review-title-rating { flex-direction: column; } .pros-cons-section { grid-template-columns: 1fr; } .review-actions { flex-direction: column; } .action-btn { width: 100%; } }
</style>
