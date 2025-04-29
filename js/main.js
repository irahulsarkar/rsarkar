document.addEventListener('DOMContentLoaded', function() {
    // ========== Auto Dark Mode Based on Time ==========
    function checkTimeForDarkMode() {
        const now = new Date();
        const hours = now.getHours();
        // Dark mode between 7 PM (19) and 6 AM (6)
        return hours >= 19 || hours < 6;
    }

    function showAutoDarkModeNotification() {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.textContent = 'Automatically set to dark mode. Change here if needed.';
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    function applyAutoDarkMode() {
        const shouldBeDark = checkTimeForDarkMode();
        const root = document.documentElement;
        const currentTheme = localStorage.getItem('theme');

        // Only auto-set if user hasn't manually set a preference
        if (!currentTheme) {
            if (shouldBeDark) {
                root.setAttribute('data-theme', 'dark');
                body.classList.add('dark-theme');
                updateIconVisibility('dark');
                showAutoDarkModeNotification();
            } else {
                root.removeAttribute('data-theme');
                body.classList.remove('dark-theme');
                updateIconVisibility('light');
            }
        }
    }
    const socialLinks = document.querySelectorAll('.social-icons a');
    const colors = ['#ff3366', '#4a6cf7', '#20c997', '#ffc107', '#17a2b8', '#6610f2'];

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = this.href;
            const icon = this.querySelector('i');
            const rect = this.getBoundingClientRect();
            const x = rect.left + rect.width/2;
            const y = rect.top + rect.height/2;

            // Phase 1: Spin for 0.5s
            this.classList.add('spinning');

            // Phase 2: After spin completes, explode
            setTimeout(() => {
                this.classList.remove('spinning');
                this.classList.add('exploding');

                // Create explosion particles
                for (let i = 0; i < 20; i++) {
                    createParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
                }

                // Phase 3: Open link after explosion completes
                setTimeout(() => {
                    window.open(targetUrl, '_blank');
                    this.classList.remove('exploding');
                }, 500);

            }, 500);
        });
    });

    function createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;

        // Random direction with more spread
        const angle = Math.random() * Math.PI * 2;
        const distance = 70 + Math.random() * 80;
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

        document.body.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 800);
    }

    // ========== Theme Toggle Functionality ==========
    const toggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const body = document.body;

    // Check for saved theme preference or use system/time preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = checkTimeForDarkMode() ? 'dark' :
                            (prefersDarkScheme.matches ? 'dark' : 'light');
    }

    // Apply the initial theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        body.classList.add('dark-theme');
    }

    // Theme icon visibility
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');

    function updateIconVisibility(theme) {
        if (theme === 'dark') {
            if (lightIcon) lightIcon.style.display = 'none';
            if (darkIcon) darkIcon.style.display = 'block';
        } else {
            if (lightIcon) lightIcon.style.display = 'block';
            if (darkIcon) darkIcon.style.display = 'none';
        }
    }

    // Initial icon visibility
    updateIconVisibility(currentTheme);

    toggle.addEventListener('click', () => {
        const root = document.documentElement;
        let theme;

        if (root.getAttribute('data-theme') === 'dark') {
            root.removeAttribute('data-theme');
            body.classList.remove('dark-theme');
            theme = 'light';
        } else {
            root.setAttribute('data-theme', 'dark');
            body.classList.add('dark-theme');
            theme = 'dark';
        }

        // Save the theme preference
        localStorage.setItem('theme', theme);
        updateIconVisibility(theme);
    });

    // Check time every minute and apply auto dark mode if needed
    applyAutoDarkMode();
    setInterval(applyAutoDarkMode, 60000); // Check every minute

    // ========== Typewriter Sound Effects ==========
    const typeSounds = [
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3'),
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1387.mp3'),
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1388.mp3')
    ];

    // Preload sounds
    typeSounds.forEach(sound => {
        sound.volume = 1;
        sound.load();
    });

    // ========== Typewriter Effect with SVG Reveal ==========
    const svgContainer = document.querySelector('.svg-container');
    const typewriterText = document.querySelector('.typewriter-text');
    const text = "\u00A0\u00A0\u00A0Rahul\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Sarkar"; // Added three non-breaking spaces
    let charIndex = 0;
    let typingComplete = false;

    if (svgContainer && typewriterText) {
        // Apply letter spacing
        typewriterText.style.letterSpacing = '3px';

        // Intersection Observer for scroll-triggered animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealSVG();
                    observer.unobserve(svgContainer);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(svgContainer);

        function revealSVG() {
            svgContainer.classList.add('revealed');

            setTimeout(() => {
                typewriterText.classList.add('typing');
                startTyping();
            }, 1000);
        }

        function startTyping() {
            if (charIndex < text.length) {
                // Play random typing sound
                const randomSound = typeSounds[Math.floor(Math.random() * typeSounds.length)];
                randomSound.currentTime = 0;
                randomSound.play().catch(e => console.log("Audio play prevented:", e));

                typewriterText.textContent = text.substring(0, charIndex + 1);
                charIndex++;

                // Speed variation
                let speed;
                if (charIndex < 3 || charIndex > text.length - 3) {
                    speed = 60; // Slower at start/end
                } else if (charIndex >= 5 && charIndex <= 8) { // Adjust for the added spaces
                    speed = 90; // Slight pause at the gap
                }
                 else {
                    speed = 1 + Math.random() * 10;
                }

                setTimeout(startTyping, speed);
            } else {
                typingComplete = true;
                // Play final "return" sound
                const returnSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-typewriter-return-key-1385.mp3');
                returnSound.volume = 0.3;
                returnSound.play().catch(e => console.log("Audio play prevented:", e));

                setTimeout(() => {
                    typewriterText.classList.remove('typing');
                    typewriterText.classList.add('completed');
                }, 2000);
            }
        }

        // Reset animation on click
        svgContainer.addEventListener('click', function() {
            if (typingComplete) {
                svgContainer.classList.remove('revealed');
                typewriterText.textContent = '';
                typewriterText.style.animation = '';
                typewriterText.classList.remove('typing', 'completed');
                charIndex = 0;
                typingComplete = false;

                setTimeout(function() {
                    svgContainer.classList.add('revealed');
                    setTimeout(() => {
                        typewriterText.classList.add('typing');
                        startTyping();
                    }, 1000);
                }, 500);
            }
        });
    }

    // ========== SVG Mirror Flip ==========
    const svgImage = document.querySelector('.svg-container img');
    if (svgImage) {
        svgImage.addEventListener('click', function() {
            this.classList.toggle('mirror-flip');
        });

        svgImage.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.toggle('mirror-flip');
        }, { passive: false });
    }

    // ========== Legacy Theme Support ==========
    const themeToggle = document.getElementById('theme-toggle');

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }
});