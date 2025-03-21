<template>
    <section class="features-section">
      <h2>Features</h2>
      <div class="features-grid">
        <div class="feature">
          <h3>Automated PFE Management</h3>
          <p>Efficiently manage and track all aspects of your final year projects.</p>
        </div>
        <div class="feature">
          <h3>Topic Assignment</h3>
          <p>Automatically or manually assign topics to student pairs.</p>
        </div>
        <div class="feature">
          <h3>Project Tracking</h3>
          <p>Monitor project progress and provide feedback.</p>
        </div>
        <div class="feature">
          <h3>Defense Organization</h3>
          <p>Plan and organize project defenses with ease.</p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'FeaturesSection'
  };
  </script>
  
  <style scoped>
  .features-section {
    padding: 2rem;
    text-align: center;
    background-color: #f8f9fa;
  }
  
  .features-section h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature {
    background-color: white;
    padding: 1.5rem;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .feature h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .feature p {
    font-size: 1rem;
    color: #666;
  }
  </style>