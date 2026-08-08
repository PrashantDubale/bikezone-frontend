<template>
  <div class="reviews-page">
    <div class="container-custom">
      <!-- ============ HERO: copy + instrument cluster ============ -->
      <div class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Owner insights</p>
          <h1>Rider reviews</h1>
          <p class="lede">
            Real feedback from riders who rely on these machines every day — the
            good, the tiring, and the unglamorous truth about ownership.
          </p>
        </div>

        <div class="cluster" role="img" aria-label="Average rating gauge">
          <svg class="cluster-gauge" viewBox="0 0 200 118" aria-hidden="true">
            <path
              class="gauge-track"
              d="M20,100 A80,80 0 0 1 180,100"
              fill="none"
              stroke-width="12"
              stroke-linecap="round"
            />
            <g
              class="gauge-needle"
              :style="{ transform: `rotate(${needleAngle}deg)` }"
            >
              <line x1="100" y1="100" x2="100" y2="32" />
            </g>
            <path
              class="gauge-fill"
              d="M20,100 A80,80 0 0 1 180,100"
              fill="none"
              stroke-width="12"
              stroke-linecap="round"
              :style="{ strokeDasharray: 251.3, strokeDashoffset: gaugeOffset }"
            />

            <circle class="gauge-pivot" cx="100" cy="100" r="6" />
          </svg>
          <div class="cluster-readout">
            <span class="cluster-value">{{ averageRating }}</span>
            <span class="cluster-unit">/ 5 avg</span>
          </div>

          <div class="cluster-digits">
            <div class="digit-block">
              <span class="digit-value">{{
                String(allReviews.length).padStart(2, "0")
              }}</span>
              <span class="digit-label">Reviews logged</span>
            </div>
            <div class="digit-divider"></div>
            <div class="digit-block">
              <span class="digit-value">{{
                String(totalBikes).padStart(2, "0")
              }}</span>
              <span class="digit-label">Bikes covered</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ Rating distribution strip ============ -->
      <div class="distribution">
        <div
          class="distribution-row"
          v-for="bucket in ratingBuckets"
          :key="bucket.stars"
        >
          <span class="distribution-label">{{ bucket.stars }}</span>
          <div class="distribution-track">
            <div
              class="distribution-fill"
              :style="{ width: bucket.percent + '%' }"
            ></div>
          </div>
          <span class="distribution-count">{{ bucket.count }}</span>
        </div>
      </div>

      <!-- ============ Review list ============ -->
      <div class="reviews-list">
        <article
          class="review-card"
          v-for="review in allReviews"
          :key="review.id"
        >
          <div class="review-top">
            <div class="avatar" aria-hidden="true">
              {{ initials(review.user) }}
            </div>

            <div class="review-heading">
              <h3 class="review-title">{{ review.title }}</h3>
              <p class="review-meta">
                <span class="bike-name">{{ review.bike }}</span>
                <span class="meta-dot">·</span>
                <span class="user-name">{{ review.user }}</span>
              </p>
            </div>

            <div
              class="star-row"
              :aria-label="`${review.rating} out of 5 stars`"
            >
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :style="{ '--fill': starFill(review.rating, n) + '%' }"
                >★</span
              >
            </div>
          </div>

          <p class="review-text">{{ review.comment }}</p>

          <div v-if="review.pros || review.cons" class="pros-cons">
            <div v-if="review.pros" class="pros">
              <h5>What worked</h5>
              <ul>
                <li v-for="(pro, idx) in review.pros" :key="idx">{{ pro }}</li>
              </ul>
            </div>
            <div v-if="review.cons" class="cons">
              <h5>What didn't</h5>
              <ul>
                <li v-for="(con, idx) in review.cons" :key="idx">{{ con }}</li>
              </ul>
            </div>
          </div>

          <div class="review-actions">
            <button class="action-btn">Helpful</button>
            <button class="action-btn">Reply</button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const allReviews = ref([
  {
    id: 1,
    title: "Perfect daily commuter",
    rating: 4.5,
    bike: "Royal Enfield Classic 350",
    user: "Rajesh Kumar",
    comment:
      "This bike is absolutely fantastic for daily commuting. Great fuel efficiency, comfortable riding position, and very reliable. Perfect for Indian roads.",
    pros: [
      "Excellent mileage",
      "Comfortable seat",
      "Great resale value",
      "Easy maintenance",
    ],
    cons: ["Heavy", "Limited features"],
  },
  {
    id: 2,
    title: "Best performance bike",
    rating: 5,
    bike: "KTM 390 Duke",
    user: "Priya Sharma",
    comment:
      "Amazing bike for enthusiasts! Responsive handling, great power delivery, and looks stunning. The ride quality is superb on highways.",
    pros: [
      "Powerful engine",
      "Excellent handling",
      "Modern styling",
      "Great braking",
    ],
    cons: ["Expensive maintenance", "Stiff suspension"],
  },
  {
    id: 3,
    title: "Reliable workhorse",
    rating: 4,
    bike: "Honda CB Shine",
    user: "Vikram Desai",
    comment:
      "Solid bike for everyday use. Very reliable, good fuel efficiency, and easy to maintain. Perfect for budget-conscious riders.",
    pros: ["Reliable", "Good mileage", "Affordable", "Easy spare parts"],
    cons: ["Basic design", "Modest power"],
  },
  {
    id: 4,
    title: "Smooth and comfortable",
    rating: 4.5,
    bike: "Yamaha FZ-X",
    user: "Anjali Menon",
    comment:
      "Versatile bike that handles both city and highway riding well. Smooth engine, good ground clearance, and comfortable for long rides.",
    pros: [
      "Versatile",
      "Smooth engine",
      "Good ground clearance",
      "Comfortable",
    ],
    cons: ["Average power", "Basic features"],
  },
  {
    id: 5,
    title: "Adventure bike extraordinaire",
    rating: 5,
    bike: "TVS Apache RTR 200",
    user: "Sanjay Patel",
    comment:
      "Excellent adventure capability with great off-road performance. Comfortable for long distance touring and perfect for exploring new trails.",
    pros: [
      "Great off-road capability",
      "Comfortable for touring",
      "Good power",
      "Durable",
    ],
    cons: ["Can be expensive to service"],
  },
  {
    id: 6,
    title: "Budget-friendly option",
    rating: 4,
    bike: "Bajaj Pulsar 150",
    user: "Mohit Singh",
    comment:
      "Great value for money bike. Good performance, reliable engine, and affordable pricing makes it a perfect choice for new riders.",
    pros: ["Affordable", "Good performance", "Reliable", "Easy to ride"],
    cons: ["Average comfort", "No features"],
  },
  {
    id: 7,
    title: "Premium cruiser feel",
    rating: 4.5,
    bike: "Triumph Street Twin",
    user: "Neha Gupta",
    comment:
      "Fantastic premium bike with classic styling. Excellent build quality, smooth riding experience, and heads turn everywhere!",
    pros: ["Premium feel", "Smooth engine", "Classic design", "Quality build"],
    cons: ["Expensive", "High maintenance cost"],
  },
  {
    id: 8,
    title: "Performance king",
    rating: 5,
    bike: "BMW S1000RR",
    user: "Ravi Krishnan",
    comment:
      "Absolute beast on track! Incredible power delivery, precision handling, and cutting-edge technology. Not for casual riders!",
    pros: [
      "Tremendous power",
      "Precision handling",
      "Advanced tech",
      "Track capable",
    ],
    cons: ["Expensive", "Overkill for normal riding"],
  },
]);

const averageRating = computed(() => {
  const sum = allReviews.value.reduce((acc, review) => acc + review.rating, 0);
  return (sum / allReviews.value.length).toFixed(1);
});

const totalBikes = computed(() => {
  const uniqueBikes = new Set(allReviews.value.map((r) => r.bike));
  return uniqueBikes.size;
});

// Semicircle gauge: 0 rating -> fully offset (empty), 5 rating -> 0 offset (full)
const gaugeOffset = computed(() => {
  const pct = Math.min(Number(averageRating.value) / 5, 1);
  return 251.3 * (1 - pct);
});

// Needle sweeps from -90deg (0 rating) to +90deg (5 rating)
const needleAngle = computed(() => {
  const pct = Math.min(Number(averageRating.value) / 5, 1);
  return -90 + pct * 180;
});

const initials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// Fill percentage for a single star icon, given a decimal rating.
// e.g. rating 4.5, star #4 -> 100, star #5 -> 50, star #1-3 -> 100
const starFill = (rating, starIndex) => {
  const diff = rating - (starIndex - 1);
  if (diff >= 1) return 100;
  if (diff <= 0) return 0;
  return Math.round(diff * 100);
};

const ratingBuckets = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviews.value.forEach((r) => {
    const bucket = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[bucket]++;
  });
  const total = allReviews.value.length || 1;
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: counts[stars],
    percent: Math.round((counts[stars] / total) * 100),
  }));
});
</script>

<style scoped>
.reviews-page {
  padding: 2.4rem 0 3.6rem;
  background: #f7f8fb;
}

/* ============ Hero ============ */
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  align-items: stretch;
  margin-bottom: 1.5rem;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.76rem;
  font-weight: 700;
}

.hero-copy h1 {
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  font-weight: 800;
  margin: 0 0 0.7rem;
  color: var(--text-primary);
  line-height: 1.05;
}

.lede {
  font-size: 1.02rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  max-width: 46ch;
}

/* ============ Instrument cluster (signature element) ============ */
.cluster {
  position: relative;
  background: radial-gradient(120% 140% at 50% 0%, #1c2035 0%, #0f1220 70%);
  border-radius: 28px;
  padding: 1.6rem 1.75rem 1.5rem;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 45px rgba(15, 18, 32, 0.35);
}

.cluster::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    115deg,
    rgba(255, 255, 255, 0.025) 0px,
    rgba(255, 255, 255, 0.025) 1px,
    transparent 1px,
    transparent 6px
  );
  pointer-events: none;
}

.cluster-gauge {
  width: 100%;
  max-width: 260px;
  height: auto;
  overflow: visible;
}

.gauge-track {
  stroke: rgba(255, 255, 255, 0.12);
}

.gauge-fill {
  stroke: var(--accent-color);
  transition: stroke-dashoffset 0.6s ease;
  filter: drop-shadow(0 0 6px rgba(255, 107, 53, 0.55));
}

/* FIX: transform-origin (and the transition that animates the rotation)
   must live on the element that actually receives the `rotate()` transform
   — the <g class="gauge-needle"> — not on its child <line>. Previously the
   origin was set on `.gauge-needle line`, so the rotated <g> fell back to
   the default SVG transform origin (0,0) and swung the needle way outside
   the gauge instead of pivoting around the center pin at (100,100). */
.gauge-needle {
  transform-origin: 100px 100px;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gauge-needle line {
  stroke: #fff;
  stroke-width: 3;
  stroke-linecap: round;
}

.gauge-pivot {
  fill: var(--accent-color);
}

.cluster-readout {
  margin-top: -1.6rem;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-variant-numeric: tabular-nums;
}

.cluster-value {
  font-family:
    ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-shadow: 0 0 12px rgba(255, 107, 53, 0.45);
}

.cluster-unit {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.cluster-digits {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin-top: 1.15rem;
  padding-top: 1.05rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  width: 100%;
  justify-content: center;
}

.digit-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.digit-value {
  font-family:
    ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.04em;
}

.digit-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.digit-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.12);
}

/* ============ Rating distribution ============ */
.distribution {
  background: white;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 1.35rem 1.5rem;
  margin-bottom: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.distribution-row {
  display: grid;
  grid-template-columns: 2.1rem 1fr 1.6rem;
  align-items: center;
  gap: 1rem;
}

.distribution-label {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.distribution-label::after {
  content: "★";
  color: rgba(148, 163, 184, 0.55);
  font-size: 0.78rem;
}

.distribution-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent-color);
  transition: width 0.5s ease;
}

.distribution-count {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ============ Review list ============ */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: white;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 1.25rem 1.4rem;
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.review-card:hover {
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.07);
  transform: translateY(-2px);
}

.review-top {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 0.75rem;
}

.avatar {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-heading {
  flex: 1;
  min-width: 0;
}

.review-title {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.2rem;
}

.review-meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.bike-name {
  color: var(--primary-color);
  font-weight: 700;
}

.meta-dot {
  margin: 0 0.35rem;
  color: rgba(148, 163, 184, 0.7);
}

.star-row {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.star {
  position: relative;
  font-size: 1.05rem;
  line-height: 1;
  color: rgba(148, 163, 184, 0.35);
}

.star::after {
  content: "★";
  position: absolute;
  inset: 0;
  color: var(--accent-color);
  width: var(--fill);
  overflow: hidden;
  white-space: nowrap;
}

.review-text {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.65;
  margin: 0;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 0.9rem 0 0.2rem;
  padding: 0.85rem 0.95rem;
  background: #f8fafc;
  border-radius: 14px;
}

.pros h5,
.cons h5 {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.45rem;
  color: var(--text-secondary);
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
  font-size: 0.88rem;
  padding-left: 1.1rem;
  position: relative;
  color: var(--text-primary);
}

.pros li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #16a34a;
}

.cons li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #dc2626;
}

.review-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.9rem;
}

.action-btn {
  padding: 0.5rem 0.85rem;
  background: #f8fafc;
  color: var(--text-secondary);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.82rem;
  font-family: inherit;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.action-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* ============ Responsive ============ */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .cluster {
    max-width: 420px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .reviews-page {
    padding: 1.75rem 0 2.5rem;
  }

  .cluster {
    padding: 1.4rem 1.25rem 1.25rem;
  }

  .review-top {
    flex-wrap: wrap;
  }

  .star-row {
    margin-left: calc(42px + 0.9rem);
  }

  .pros-cons {
    grid-template-columns: 1fr;
  }

  .review-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .review-card,
  .gauge-fill,
  .gauge-needle line {
    transition: none;
  }
}
</style>