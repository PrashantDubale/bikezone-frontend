import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const Home = () => import('../pages/Home.vue')
const BikesList = () => import('../pages/BikesList.vue')
const BikeDetail = () => import('../pages/BikeDetail.vue')
const Compare = () => import('../pages/Compare.vue')
const Reviews = () => import('../pages/Reviews.vue')
const Login = () => import('../pages/Login.vue')
const SignUp = () => import('../pages/SignUp.vue')
const AdminBikes = () => import('../pages/AdminBikes.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bikes',
    name: 'BikesList',
    component: BikesList
  },
  {
    path: '/bikes/:id',
    name: 'BikeDetail',
    component: BikeDetail
  },
  {
    path: '/compare',
    name: 'Compare',
    component: Compare
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: Reviews
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/admin',
    name: 'AdminBikes',
    component: AdminBikes,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard: only logged-in admins can reach /admin.
// Everyone else is redirected — logged-out users to /login (with a
// redirect back here after they log in), logged-in non-admins to home.
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAdmin) {
    next()
    return
  }

  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (!authStore.isAdmin) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router