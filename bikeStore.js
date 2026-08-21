import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useBikeStore = defineStore('bike', () => {
  const bikes = ref([])
  const brands = ref([])
  const featured = ref([])
  const compareCart = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedBrand = ref('')
  const selectedCategory = ref('')
  const priceRange = ref([0, 2500000])

  const API_BASE = import.meta.env.VITE_API_BASE

  const fetchBikes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/bikes`)
      bikes.value = response.data
    } catch (err) {
      console.error('Error fetching bikes:', err)
      // Surface *why* the list is empty instead of silently showing
      // "No bikes found" — that message should only mean "no matches",
      // not "the API call failed".
      error.value = err.response
        ? `Server error (${err.response.status}). Is the backend running and pointed at the right database?`
        : `Could not reach the API at ${API_BASE}. Is the backend running?`
    } finally {
      loading.value = false
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE}/brands`)
      brands.value = response.data
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const fetchFeatured = async () => {
    try {
      const response = await axios.get(`${API_BASE}/featured`)
      featured.value = response.data
    } catch (error) {
      console.error('Error fetching featured bikes:', error)
    }
  }

  const searchBikes = async (query) => {
    loading.value = true
    try {
      const response = await axios.get(`${API_BASE}/bikes/search`, {
        params: { q: query }
      })
      bikes.value = response.data
    } catch (error) {
      console.error('Error searching bikes:', error)
    } finally {
      loading.value = false
    }
  }

  const filterBikes = computed(() => {
    return bikes.value.filter(bike => {
      const matchesSearch = bike.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          bike.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesBrand = !selectedBrand.value || bike.brand === selectedBrand.value
      const matchesCategory = !selectedCategory.value || bike.category === selectedCategory.value
      const matchesPrice = bike.price >= priceRange.value[0] && bike.price <= priceRange.value[1]

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice
    })
  })

  const addToCompare = (bike) => {
    if (compareCart.value.length < 4 && !compareCart.value.find(b => b.id === bike.id)) {
      compareCart.value.push(bike)
    }
  }

  const removeFromCompare = (bikeId) => {
    compareCart.value = compareCart.value.filter(b => b.id !== bikeId)
  }

  const clearCompare = () => {
    compareCart.value = []
  }

  return {
    bikes,
    brands,
    featured,
    compareCart,
    loading,
    error,
    searchQuery,
    selectedBrand,
    selectedCategory,
    priceRange,
    filterBikes,
    fetchBikes,
    fetchBrands,
    fetchFeatured,
    searchBikes,
    addToCompare,
    removeFromCompare,
    clearCompare
  }
})