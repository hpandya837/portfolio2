document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for internal links (optional)
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
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
    const gameCardsElements = document.querySelectorAll('.game-card'); // If hardcoded

    // Example: If you want to dynamically create cards or have more complex logic
    const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D']; // Example pairs
    let flippedCards = [];
    let matchedPairs = 0;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        shuffle(cardValues);
        // If you are creating cards dynamically:
        // gameGrid.innerHTML = ''; // Clear existing cards
        // cardValues.forEach(value => {
        //     const card = document.createElement('div');
        //     card.classList.add('game-card');
        //     card.dataset.value = value; // Store the value in a data attribute
        //     card.textContent = '?'; // Initially hidden
        //     card.addEventListener('click', handleCardClick);
        //     gameGrid.appendChild(card);
        // });

        // If using hardcoded HTML cards, assign values and event listeners
        gameCardsElements.forEach((card, index) => {
            if (cardValues[index]) {
                card.dataset.value = cardValues[index];
                card.addEventListener('click', handleCardClick);
            } else {
                card.style.visibility = 'hidden'; // Hide if not enough values for cards
            }
        });
    }

    function handleCardClick(event) {
        const clickedCard = event.target;

        // Prevent clicking if card is already flipped or matched, or if 2 cards are already flipped
        if (clickedCard.classList.contains('revealed') || flippedCards.length === 2) {
            return;
        }

        clickedCard.textContent = clickedCard.dataset.value;
        clickedCard.classList.add('revealed');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            // Matched
            card1.removeEventListener('click', handleCardClick); // Prevent further clicks on matched cards
            card2.removeEventListener('click', handleCardClick);
            matchedPairs++;
            flippedCards = [];
            if (matchedPairs === cardValues.length / 2) {
                // Replaced alert with console.log for canvas compatibility
                console.log('Congratulations! You found all pairs!');
                // You could add a reset button or auto-reset here
            }
        } else {
            // Not a match
            setTimeout(() => {
                card1.textContent = '?';
                card1.classList.remove('revealed');
                card2.textContent = '?';
                card2.classList.remove('revealed');
                flippedCards = [];
            }, 1000); // Show for 1 second before flipping back
        }
    }

    // Initialize the game if the grid exists
    if (gameGrid && gameCardsElements.length > 0) {
        createBoard();
    }


    // --- Intersection Observer for Animations (Optional) ---
    const sections = document.querySelectorAll('section');
    const options = {
        root: null, // viewport
        threshold: 0.1, // 10% of the section is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Add a class to trigger animation
                // observer.unobserve(entry.target); // Optional: stop observing once visible
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
    // Add CSS for .is-visible (e.g., opacity, transform)
    // section { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
    // section.is-visible { opacity: 1; transform: translateY(0); }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simulate sending data (in a real app, you'd send this to a server)
            console.log('Contact Form Submitted:');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);

            // Display success message
            contactMessage.style.display = 'block';
            contactMessage.style.color = '#4CAF50'; // Green success message

            // Clear the form fields
            contactForm.reset();

            // Hide message after a few seconds
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

    // Function to update the skill description
    function updateSkillDescription(skill) {
        if (skillProficiencies[skill]) {
            skillDescriptionElement.style.opacity = 0; // Fade out
            setTimeout(() => {
                skillDescriptionElement.textContent = skillProficiencies[skill];
                skillDescriptionElement.style.opacity = 1; // Fade in
            }, 300); // Match CSS transition duration
        } else {
            skillDescriptionElement.textContent = "Click on a skill above to learn more about my proficiency in it!";
            skillDescriptionElement.style.opacity = 1;
        }
    }

    // Add click listeners to each skill icon
    skillIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            // Remove 'active' class from all icons
            skillIcons.forEach(i => i.classList.remove('active'));
            // Add 'active' class to the clicked icon
            icon.classList.add('active');

            const skill = icon.dataset.skill;
            updateSkillDescription(skill);
        });
    });

    // Set initial description for the first skill or a default message
    // You can uncomment the line below to set JavaScript as active by default
    // if (skillIcons.length > 0) {
    //     skillIcons[0].classList.add('active');
    //     updateSkillDescription(skillIcons[0].dataset.skill);
    // }
});