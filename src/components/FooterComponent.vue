<script setup></script>
<template>
    <footer class="footer">
        <!-- First Section: Logo and Contact Info -->
        <div class="footer-section">
            <a href="#"><img src="./imgs/pfe_man_logo_whole_final.svg" alt="Logo" class="footer-logo"></a>
            
            <div class="contact-info">
                <p><strong>Email:</strong> pfe.management@usms.ma</p>
                <p><strong>Téléphone:</strong> +1 234 567 890</p>
            </div>
        </div>

        <!-- Second Section: Logo and Contact Info -->
        <div class="footer-section">
            <a href="https://estfbs.usms.ac.ma">            <img src="./imgs/LogoESTFBS.png" alt="Logo" class="footer-logo">
            </a>
            <div class="contact-info">
                <p><strong>Localisation:</strong> Hay Tighnari, Route nationale N11 de Casablanca commune de Fkih Ben Salah, Boite Postale 336</p>
                <p><strong>Email:</strong> estfbs@usms.ma</p>
                <p><strong>Téléphone:</strong> +212 5 23 43 46 66</p>
                <p><strong>Fixe:</strong> +212 5 23 43 49 99</p>
                <p><strong>Site Web:</strong> <a href="https://estfbs.usms.ac.ma">estfbs.usms.ac.ma</a></p>
            </div>
        </div>

        <!-- Third Section: Navigation Links -->
        <div class="footer-section">
            <h4 style="margin-bottom: 15px; color: #416173;">Navigation</h4>
            <nav class="footer-nav">
                <a href="#">Home</a>
                <a href="#">À propos</a>
                <a href="#">Contactez-nous</a>
                <a href="#">Se connecter</a>
            </nav>
        </div>
        
        <!-- Copyright Section -->
        <div class="copyright">
            © 2025 EST Fkih Ben Salah. Tous droits réservés.
        </div>
    </footer>
</template>

<style scoped>
/* Footer styling to match header */
.footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 30px 20px;
        background-color: #ffffff;
        color: #333;
        flex-wrap: wrap;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Footer section styling */
    .footer-section {
        flex: 1;
        min-width: 200px;
        margin: 10px;
    }

    /* Footer logo styling */
    .footer-logo {
        height: 60px;
        margin-bottom: 15px;
    }

    /* Contact info styling */
    .contact-info {
        font-size: 14px;
        line-height: 1.5;
    }

    .contact-info p {
        margin: 8px 0;
        color: #555;
    }

    .contact-info strong {
        color: #416173;
        font-weight: 600;
    }

    /* Footer navigation styling */
    .footer-nav {
        display: flex;
        flex-direction: column;
    }

    .footer-nav a {
        position: relative;
        color: #83a1c9;
        text-decoration: none;
        margin: 8px 0;
        padding: 5px 0;
        font-size: 14px;
        line-height: normal;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        overflow: hidden;
        transition: color 0.3s ease;
    }

    .footer-nav a:hover {
        color: #eaefdb;
    }

    .footer-nav a:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #416173;
        transition: width 0.3s ease;
    }

    .footer-nav a:hover:after {
        width: 100%;
    }

    /* Copyright section */
    .copyright {
        width: 100%;
        text-align: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #e0e0e0;
        font-size: 12px;
        color: #777;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .footer-section {
            margin: 20px 0;
            width: 100%;
            max-width: 400px;
        }

        .footer-nav {
            align-items: center;
        }
        
        .footer-nav a:after {
            left: 50%;
            transform: translateX(-50%);
        }}
</style>
