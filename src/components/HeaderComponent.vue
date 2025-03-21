<script setup>import { RouterLink } from 'vue-router';</script>
<template>
    <header class="header">
      <div class="logo-container">
        <img
          src="./imgs/LogoESTFBS.png"
          alt="Logo 1"
          class="logo"
        />
        <img
          src="./imgs/pfe_man_logo_whole_final.svg"
          alt="Logo 2"
          class="logo"
        />
      </div>
      <div class="centerer">
        <div class="wrap">
          <router-link to="/seConnecter" class="btn-6">Se Connecter<span></span></router-link>
        </div>
      </div>
    </header>
  </template>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .logo {
    height: 3rem;
    max-width: 100%;
    object-fit: contain;
  }
  
  .centerer {
    display: flex;
    align-items: center;
  }
  
  .wrap {
    position: relative;
  }
  
  .btn-6 {
    display: inline-block;
    position: relative;
    background-color: #4285f4;
    color: white;
    font-weight: 600;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  .btn-6:hover {
    color: #4285f4;
  }
  
  .btn-6 span {
    position: absolute;
    width: 0;
    height: 100%;
    background-color: white;
    left: 0;
    bottom: 0;
    z-index: -1;
    transition: width 0.3s ease;
  }
  
  .btn-6:hover span {
    width: 100%;
  }
  
  /* Make the header responsive */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }
    
    .logo-container {
      width: 100%;
      justify-content: center;
    }
    
    .centerer {
      width: 100%;
      justify-content: center;
    }
  }
  </style>