<template>
      <div class="landing-page">
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
    </div>
    
  </template>
  
  <script setup>
  import HeaderComponent from '@/components/HeaderComponent.vue';
  import HeroSection from '@/components/HeroSection.vue';
  import FeaturesSection from '@/components/FeaturesSection.vue';
  import CallToAction from '@/components/CallToAction.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  
  </script>
  
  <style scoped>
  .landing-page {
    font-family: Arial, sans-serif;
    color: #333;
  }
  </style>