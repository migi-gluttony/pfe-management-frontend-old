<template>
    <section class="cta-section">
      <h2>Ready to Get Started?</h2>
      <p>Join us today and take control of your final year projects.</p>
      <router-link to="/register" class="cta-button">Sign Up Now</router-link>
    </section>
  </template>
  
  <script>
  export default {
    name: 'CallToAction'
  };
  </script>
  
  <style scoped>
  .cta-section {
    padding: 2rem;
    text-align: center;
    background-color: #007bff;
    color: white;
  }
  
  .cta-section h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .cta-section p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    background-color: white;
    color: #007bff;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  }
  
  .cta-button:hover {
    background-color: #f8f9fa;
  }
  </style>