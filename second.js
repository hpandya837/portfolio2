document.addEventListener('DOMContentLoaded', () => {
  
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

    // Smooth scrolling for internal links (optional, if you add any internal links)
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

    // --- Three.js Network of Ideas Animation Logic (Reverted) ---
    let scene, camera, renderer;
    let particles, particlePositions, particleColors;
    let lines, linePositions, lineColors;

    const particleCount = 500; // Increased particle count for a denser network
    const maxParticleDistance = 1.5; // Max distance for particles to connect
    const lineSegmentCount = 2; // For drawing lines: two points per line segment
    const lineOpacityDecay = 0.01; // How fast lines fade
    const particleMovementSpeed = 0.001; // Speed of individual particle jitter
    const overallRotationSpeed = 0.0005; // Speed of the entire system rotation

    const canvasElement = document.getElementById('threeJsCanvas');

    function initThreeJS() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200); // Adjusted far plane
        camera.position.z = 10; // Position camera further back to see more of the network

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0); // Transparent background

        // Particles (Nodes)
        const particleGeometry = new THREE.BufferGeometry();
        particlePositions = new Float32Array(particleCount * 3); // x, y, z for each particle
        particleColors = new Float32Array(particleCount * 3); // r, g, b for each particle
        const particleVelocities = []; // To store individual particle movement vectors

        for (let i = 0; i < particleCount; i++) {
            // Distribute particles in a larger, more diffuse volume
            const x = (Math.random() - 0.5) * 20; // Increased spread
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 10;
            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;

            // Random initial velocity for subtle jitter
            particleVelocities.push(
                (Math.random() - 0.5) * particleMovementSpeed,
                (Math.random() - 0.5) * particleMovementSpeed,
                (Math.random() - 0.5) * particleMovementSpeed
            );

            // Colors for nodes: accent blues/purples, some white/cyan
            const color = new THREE.Color();
            // Vary hue slightly around blue/cyan, full saturation, varied lightness
            color.setHSL(0.55 + (Math.random() * 0.1 - 0.05), 0.9 + (Math.random() * 0.1 - 0.05), 0.6 + Math.random() * 0.3);
            particleColors[i * 3] = color.r;
            particleColors[i * 3 + 1] = color.g;
            particleColors[i * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        particleGeometry.velocities = particleVelocities; // Attach velocities to geometry

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1, // Smaller node size
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending // For glowing effect
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Lines
        const lineGeometry = new THREE.BufferGeometry();
        linePositions = new Float32Array(particleCount * particleCount * lineSegmentCount * 3); // Max possible lines * 2 points * 3 coords
        lineColors = new Float32Array(particleCount * particleCount * lineSegmentCount * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // Handle window resizing
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation loop
    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);

        // Update particle positions and apply subtle jitter
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.velocities;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            // Simple boundary check to keep particles somewhat centered
            if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 7.5) velocities[i * 3 + 1] *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true; // Mark as updated

        // Update lines based on particle proximity
        let lineIndex = 0;
        const tempColor = new THREE.Color();
        const colors = lines.geometry.attributes.color.array;

        // Reset line colors to transparent for decay effect
        for(let i = 0; i < lineColors.length; i++) {
            lineColors[i] = Math.max(0, lineColors[i] - lineOpacityDecay);
        }

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < maxParticleDistance) {
                    const opacity = 1 - (distance / maxParticleDistance); // Fade lines based on distance
                    
                    // Particle 1 (start of line)
                    linePositions[lineIndex++] = positions[i * 3];
                    linePositions[lineIndex++] = positions[i * 3 + 1];
                    linePositions[lineIndex++] = positions[i * 3 + 2];

                    // Particle 2 (end of line)
                    linePositions[lineIndex++] = positions[j * 3];
                    linePositions[lineIndex++] = positions[j * 3 + 1];
                    linePositions[lineIndex++] = positions[j * 3 + 2];

                    // Color for both points of the line, based on blended particle colors and opacity
                    tempColor.setRGB(
                        (particleColors[i * 3] + particleColors[j * 3]) / 2,
                        (particleColors[i * 3 + 1] + particleColors[j * 3 + 1]) / 2,
                        (particleColors[i * 3 + 2] + particleColors[j * 3 + 2]) / 2
                    );
                    
                    // Apply opacity to the line color
                    colors[lineIndex - 6] = tempColor.r * opacity;
                    colors[lineIndex - 5] = tempColor.g * opacity;
                    colors[lineIndex - 4] = tempColor.b * opacity;
                    colors[lineIndex - 3] = tempColor.r * opacity;
                    colors[lineIndex - 2] = tempColor.g * opacity;
                    colors[lineIndex - 1] = tempColor.b * opacity;
                }
            }
        }
        
        // Clear unused line segments by setting their length to 0
        for (let i = lineIndex; i < linePositions.length; i++) {
            linePositions[i] = 0;
            lineColors[i] = 0; // Ensure color is also zeroed out for transparency
        }

        lines.geometry.attributes.position.needsUpdate = true;
        lines.geometry.attributes.color.needsUpdate = true; // Mark line colors as updated

        // Overall rotation for the entire system
        particles.rotation.x += overallRotationSpeed;
        particles.rotation.y += overallRotationSpeed * 1.5; // Slightly different rotation speed

        lines.rotation.copy(particles.rotation); // Ensure lines rotate with particles

        renderer.render(scene, camera);
    }

    // Initialize and animate Three.js when the window loads
    window.onload = function () {
        if (canvasElement) {
            initThreeJS();
            animateThreeJS();
        }
    }
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

