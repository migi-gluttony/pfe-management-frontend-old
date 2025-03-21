<script setup>
</script>

<template>
    <div class="chefDepartementDashboard">
        <h1>Chef de département</h1>
        <div class="links">
            <router-link to="/chefDepartementDashboard/sujetManagement" class="link">
                <div class="icon">📝</div>
                <span>Gestion des sujets</span>
            </router-link>
            <router-link to="/chefDepartementDashboard/binomeManagement" class="link">
                <div class="icon">👥</div>
                <span>Gestion des binômes</span>
            </router-link>
            <router-link to="/chefDepartementDashboard/soutenanceManagement" class="link">
                <div class="icon">🎤</div>
                <span>Gestion des soutenances</span>
            </router-link>
            <router-link to="/chefDepartementDashboard/notesManagement" class="link">
                <div class="icon">📊</div>
                <span>Gestion des notes</span>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
:root {
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --accent-color: #93c5fd;
    --text-color: #333;
    --text-light: #fff;
    --light-gray: #f3f4f6;
    --border-radius: 12px;
    --shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}

.chefDepartementDashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    background-color: var(--light-gray);
    min-height: 100vh;
    text-align: center;
    font-family: 'Arial', sans-serif;
}

h1 {
    font-size: 32px;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 40px;
    position: relative;
}

h1::after {
    content: '';
    position: absolute;
    width: 60%;
    height: 4px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    bottom: -10px;
    left: 20%;
    border-radius: 4px;
}

.links {
    display: grid;
    grid-template-columns: 50% 50%;    grid-template-rows: repeat(2, 1fr);
    gap: 25px;
    width: 100%;
    max-width: 650px;
}

.link {
    background-color: white;
    padding: 25px 15px;
    border-radius: var(--border-radius);
    text-decoration: none;
    color: var(--text-color);
    font-weight: 600;
    box-shadow: var(--shadow);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    border-bottom: 4px solid var(--accent-color);
    position: relative;
    overflow: hidden;
}

.link::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--primary-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.link:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
    background: linear-gradient(135deg, white, #f0f7ff);
}

.link:hover::before {
    transform: scaleX(1);
}

.icon {
    font-size: 32px;
    margin-bottom: 10px;
    background-color: #e0edff;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    transition: var(--transition);
}

.link:hover .icon {
    background-color: var(--primary-color);
    color: var(--text-light);
    transform: scale(1.1);
}

@media (max-width: 600px) {
    .links {
        grid-template-columns: 1fr;
    }
}
</style>