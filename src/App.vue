<template>
  <div class="app">
    <!-- Header and Footer are global (appear on every page) -->
    <HeaderComponent />
    
    <!-- Router view for dynamic content -->
    <router-view></router-view>
    
    <FooterComponent />
  </div>
</template>

<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the page takes at least the full viewport height */
}
</style>