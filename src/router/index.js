import { createRouter, createWebHistory } from 'vue-router'
import SeConnecter from '@/views/seConnecter.vue'
import LandingPage from '@/views/landingPage.vue'
import SujetManagement from '@/views/sujetManagement.vue'
import BinomeManagement from '@/views/binomeManagement.vue'
import SoutenanceManagement from '@/views/soutenanceManagement.vue'
import ComptesManagement from '@/views/comptesManagement.vue'
import NotesManagement from '@/views/notesManagement.vue'
import ChefDepartementDashboard from '@/views/chefDepartementDashboard.vue'
import ChoisirBinome from '@/views/choisirBinome.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/seConnecter',
      name: 'seConnecter',
      component: SeConnecter,
    },
    {
      path: '/sujetManagement',
      name: 'sujetManagement',
      component: SujetManagement,
    },
    {
      path: '/binomeManagement',
      name: 'binomeManagement',
      component: BinomeManagement,
    },
    {
      path: '/soutenanceManagement',
      name: 'soutenanceManagement',
      component: SoutenanceManagement,
    },
    {
      path: '/comptesManagement',
      name: 'comptesManagement',
      component: ComptesManagement,
    },
    {
      path: '/notesManagement',
      name: 'notesManagement',
      component: NotesManagement,
    },
    {
      path:'/chefDepartementDashboard',
      name:'chefDepartementDashboard',
      component:ChefDepartementDashboard,
    },
    {
      path:'/choisirBinome',
      name:'choisirBinome',
      component:ChoisirBinome,
    }
  ],
})
export default router
