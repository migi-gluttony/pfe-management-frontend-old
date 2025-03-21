<template>
    <section class="hero-section">
      <div class="hero-content">
        <h1>Welcome to PFE Management</h1>
        <p>Streamline your final year projects with our comprehensive management tool.</p>
        <router-link to="/login" class="cta-button">Get Started</router-link>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroSection'
  };
  </script>
  
  <style scoped>
  .hero-section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    background-color: #007bff;
    color: white;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .hero-content p {
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