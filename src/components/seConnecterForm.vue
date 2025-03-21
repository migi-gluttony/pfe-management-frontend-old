<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  
  try {
    // Here you would add your authentication logic
    // For example: await authService.login(email.value, password.value);
    console.log('Login attempt with:', email.value);
    
    // Redirect to dashboard or home after successful login
    // router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
};


const goToForgotPassword = () => {
  router.push('/forgot-password');
};
</script>

<template>
  <div class="login-container">
    <h1>Se Connecter</h1>
    
    <form class="login-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email :</label>
        <input 
          type="email" 
          id="email" 
          v-model="email"
          placeholder="nom.prenom@email.com" 
          required
        >
        <i class="fas fa-envelope form-icon"></i>
      </div>
      
      <div class="form-group">
        <label for="motdepasse">Mot de passe :</label>
        <input 
          type="password" 
          id="motdepasse" 
          v-model="password"
          placeholder="Votre mot de passe" 
          required
        >
        <i class="fas fa-lock form-icon"></i>
      </div>
      
      <div class="forgot-password">
        <a href="#" @click.prevent="goToForgotPassword">Mot de passe oublié?</a>
      </div>
      
      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="loading"
      >
        {{ loading ? 'Chargement...' : 'Se connecter' }}
      </button>
      
      
    </form>
  </div>
</template>

<style scoped>
/* Root variables for colors and transitions */
:root {
  --primary-color: #1a73e8;
  --primary-hover: #0d5bba;
  --text-color: #333;
  --light-gray: #f9f9f9;
  --border-color: #e0e0e0;
  --shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
}

/* Login container */
.login-container {
    padding: 50px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  margin: 0 auto;
}

/* Heading */
h1 {
  color: var(--primary-color);
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

h1::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 4px;
  background-color: var(--primary-color);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

/* Login form */
.login-form {
  background-color: white;
  border-radius: 12px;
  padding: 35px;
  box-shadow: var(--shadow);
  text-align: left;
}

/* Form group */
.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 8px;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: var(--transition);
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

.form-group input::placeholder {
  color: #a0a0a0;
}

/* Form icon */
.form-icon {
  position: absolute;
  right: 15px;
  top: 44px;
  color: #888;
}

/* Forgot password link */
.forgot-password {
  text-align: right;
  margin: -10px 0 20px;
}

.forgot-password a {
  color: var(--primary-color);
  font-size: 0.9rem;
  text-decoration: none;
  transition: var(--transition);
}

.forgot-password a:hover {
  text-decoration: underline;
}

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

/* Login footer */
.login-footer {
  margin-top: 25px;
  font-size: 0.9rem;
  color: #666;
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 500px) {
  .login-form {
    padding: 25px 20px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
</style>