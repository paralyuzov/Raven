import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import AuthLayout from '../layouts/AuthLayout.vue'
import GuestLayout from '../layouts/GuestLayout.vue'

import LoginPage from '../views/LoginPage.vue'
import RegistrationPage from '../views/RegistrationPage.vue'

import ChatPage from '../views/ChatPage.vue'
import ProfilePage from '../views/ProfilePage.vue'


const routes = [
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: '',
        name: 'registration',
        component: RegistrationPage
      },
      {
        path: 'login',
        name: 'login',
        component: LoginPage
      }
    ],
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'messages',
        name: 'messages',
        component: ChatPage
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfilePage
      },
    ],
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }
  
  if (to.meta.requiresGuest && isLoggedIn) {
    return next('/messages')
  }
  
  return next()
})

export default router
