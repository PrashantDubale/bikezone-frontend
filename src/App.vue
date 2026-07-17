<template>
  <div class="app">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBikeStore } from './stores/bikeStore'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const bikeStore = useBikeStore()

onMounted(() => {
  if (!bikeStore.bikes.length) bikeStore.fetchBikes()
  if (!bikeStore.brands.length) bikeStore.fetchBrands()
  if (!bikeStore.featured.length) bikeStore.fetchFeatured()
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

main {
  flex: 1;
}
</style>
