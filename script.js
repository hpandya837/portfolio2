document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for internal links
    const navLinks = document.querySelectorAll('.navlinks a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && this.hostname === location.hostname && this.pathname === location.pathname) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    const mainListDiv = document.getElementById('mainListDiv');
                    const navTrigger = document.querySelector('.navTrigger');
                    if (mainListDiv.classList.contains('show_list')) {
                        mainListDiv.classList.remove('show_list');
                        navTrigger.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            } else if (href === "about.html") {
                return;
            }
        });
    });

    // Dynamic year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Memory Lane Game Logic ---
    const gameGrid = document.querySelector('.memory-game-grid');
    const resetButton = document.getElementById('resetGameButton');
    let gameCards = [];

    // Image URLs for the memory game tiles
    const imageUrls = [
        "IMG_0799 (2).jpeg", // Grand Canyon
        "IMG_0789 (1).jpeg", // Hoover Dam
        "5B8B0C2F-7429-413D-9A3F-2FBF7043A3EB (2).jpeg", // Brooklyn Bridge
        "IMG_0785 (2).jpeg", // Cappuccino
        "IMG_0845 (2).jpeg", // Hot Air Balloons
        "IMG_7325 (1).jpeg", // Railway Track
        "IMG_8588.jpeg", // US Capitol
        "IMG_8757 (1).jpeg8", // Niagara Falls
        "IMG_8726 (1).jpeg", // Sunrise Malmö / Pier
        "IMG_9409 (1).jpeg"  // Epcot
    ];


    const gameCardPairs = [...imageUrls, ...imageUrls];

    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        shuffle(gameCardPairs);
        gameGrid.innerHTML = '';
        matchedPairs = 0;
        flippedCards = [];
        canFlip = true;
        resetButton.style.display = 'none';

        for (let i = 0; i < gameCardPairs.length; i++) {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.dataset.imageUrl = gameCardPairs[i];

            const img = document.createElement('img');
            img.src = gameCardPairs[i];
            img.alt = "Memory Game Tile";
            // Update the onerror placeholder image size to match the new card height
            img.onerror = function() { this.src = 'https://placehold.co/250x250/2a2a2a/ffffff?text=Image+Error'; };
            card.appendChild(img);

            card.addEventListener('click', handleCardClick);
            gameGrid.appendChild(card);
            card.classList.remove('revealed', 'matched');
        }
    }

    function handleCardClick(event) {
        const clickedCard = event.target.closest('.game-card');

        if (!clickedCard || !canFlip || clickedCard.classList.contains('revealed') || clickedCard.classList.contains('matched') || flippedCards.includes(clickedCard)) {
            return;
        }

        clickedCard.classList.add('revealed');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            canFlip = false;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.imageUrl === card2.dataset.imageUrl) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.removeEventListener('click', handleCardClick);
            card2.removeEventListener('click', handleCardClick);
            matchedPairs++;
            flippedCards = [];
            canFlip = true;

            if (matchedPairs === imageUrls.length) {
                console.log('Congratulations! You found all pairs!');
                resetButton.style.display = 'block';
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('revealed');
                card2.classList.remove('revealed');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    function resetGame() {
        createBoard();
    }

    if (gameGrid) {
        createBoard();
        resetButton.addEventListener('click', resetGame);
    }


    // --- Intersection Observer for Animations (Optional) ---
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });


    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            console.log('Contact Form Submitted:');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);

            contactMessage.style.display = 'block';
            contactMessage.style.color = '#4CAF50';

            contactForm.reset();

            setTimeout(() => {
                contactMessage.style.display = 'none';
            }, 5000);
        });
    }

    // --- Skill Description Logic ---
    const skillIcons = document.querySelectorAll('.tech-icon');
    const skillDescriptionElement = document.getElementById('skill-description');

    const skillProficiencies = {
        javascript: "I have extensive experience with JavaScript, including ES6+, asynchronous programming, and modern frameworks like React. I've built dynamic and interactive web applications, focusing on performance and user experience.",
        java: "My Java expertise covers backend development, object-oriented design, and enterprise-level applications. I'm proficient in using Java for robust and scalable solutions.",
        html: "I possess strong HTML5 skills, creating well-structured, semantic, and accessible web content. I ensure cross-browser compatibility and adherence to web standards.",
        css: "I excel in CSS3, utilizing advanced techniques like Flexbox, Grid, and responsive design principles to craft visually appealing and adaptive user interfaces. I'm also familiar with preprocessors like SCSS."
    };

    function updateSkillDescription(skill) {
        if (skillProficiencies[skill]) {
            skillDescriptionElement.style.opacity = 0;
            setTimeout(() => {
                skillDescriptionElement.textContent = skillProficiencies[skill];
                skillDescriptionElement.style.opacity = 1;
            }, 300);
        } else {
            skillDescriptionElement.textContent = "Click on a skill above to learn more about my proficiency in it!";
            skillDescriptionElement.style.opacity = 1;
        }
    }

    skillIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            skillIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
            const skill = icon.dataset.skill;
            updateSkillDescription(skill);
        });
    });

    // --- New Navbar Logic (Converted from jQuery) ---
    const nav = document.querySelector('.nav');
    const mainListDiv = document.getElementById('mainListDiv');
    const navTrigger = document.querySelector('.navTrigger');

    // Scroll event for affix class
    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 50) {
            nav.classList.add('affix');
        } else {
            nav.classList.remove('affix');
        }
    });

    // Nav Trigger click event for mobile menu
    navTrigger.addEventListener('click', () => {
        navTrigger.classList.toggle('active');
        mainListDiv.classList.toggle('show_list');
        if (mainListDiv.classList.contains('show_list')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // --- Three.js Animation Logic ---
    let scene, camera, renderer, particles;
    const canvasElement = document.getElementById('threeJsCanvas');

    function initThreeJS() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const particleCount = 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            positions.push(x, y, z);

            const color = new THREE.Color();
            // Increased the saturation and lightness values for brighter colors
            color.setHSL(0.55 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.4); // Adjusted for brighter colors
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            transparent: true,
            opacity: 1, // Increased opacity to 1 for more solid appearance
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);

        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0004;
        particles.position.z += 0.002;
        if (particles.position.z > 5) {
            particles.position.z = -5;
        }

        renderer.render(scene, camera);
    }

    window.onload = function () {
        if (canvasElement) {
            initThreeJS();
            animateThreeJS();
        }
    }
});
