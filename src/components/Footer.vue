<template>
  <footer class="footer">
    <div class="container-custom">
      <div class="footer-content">
        <div class="footer-section">
          <img :src="`/assets/bikezone-crop.png`" alt="BikeZone" class="footer-logo" />
          <!-- <h3>BikeZone</h3> -->
          <p>Your premium motorcycle discovery platform for comparing, choosing, and understanding the next ride.</p>
        </div>

        <div class="footer-section">
          <h4>Quick links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/bikes">Browse bikes</router-link></li>
            <li><router-link to="/reviews">Reviews</router-link></li>
            <li><router-link to="/compare">Compare</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Popular brands</h4>
          <ul>
            <li><a href="#" @click.prevent>Royal Enfield</a></li>
            <li><a href="#" @click.prevent>Honda</a></li>
            <li><a href="#" @click.prevent>Yamaha</a></li>
            <li><a href="#" @click.prevent>KTM</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="#" class="social-icon">FB</a>
            <a href="#" class="social-icon">X</a>
            <a href="#" class="social-icon">IG</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2024 BikeZone. All rights reserved.</p>
        <p>Ride. Compare. Decide.</p>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer { background: #111827; color: white; padding: 3rem 0 1.4rem; margin-top: 4.5rem; }
.footer-logo { width: 250px; margin-bottom: 0.8rem; }
.footer-content { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:2rem; margin-bottom:2rem; }
.footer-section h3 { font-size: 1.25rem; margin:0 0 0.6rem; color: var(--accent-color); }
.footer-section h4 { font-size: 0.95rem; margin:0 0 0.75rem; font-weight: 700; }
.footer-section p, .footer-section a { color:#d1d5db; font-size:0.95rem; line-height:1.7; text-decoration:none; }
.footer-section ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem; }
.footer-section a:hover { color: var(--accent-color); }
.social-links { display:flex; gap:0.7rem; flex-wrap:wrap; }
.social-icon { display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; background: rgba(255,107,53,0.16); border-radius:999px; font-size:0.8rem; font-weight:700; }
.social-icon:hover { background: rgba(255,107,53,0.28); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; text-align:center; color:#d1d5db; font-size:0.9rem; }
.footer-bottom p { margin:0.35rem 0; }
@media (max-width: 768px) { .footer-content { grid-template-columns: repeat(2, minmax(0,1fr)); } }
</style>
