// Nested Router Implementation
class NestedRouter {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.currentPath = [];
        this.init();
    }

    init() {
        // Handle initial route
        this.handleRoute();
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
    }

    handleRoute() {
        const hash = window.location.hash || '#/';
        const pathSegments = hash.split('/').filter(segment => segment !== '');
        
        // Remove the # from the first segment
        if (pathSegments.length > 0 && pathSegments[0].startsWith('#')) {
            pathSegments[0] = pathSegments[0].substring(1);
        }
        
        this.navigateToPath(pathSegments);
    }

    navigateToPath(pathSegments) {
        // Build the route path
        const routePath = pathSegments.length > 0 ? '/' + pathSegments.join('/') : '/';
        const routeId = this.getRouteId(pathSegments);
        
        if (routeId && routeId !== this.currentRoute) {
            this.currentPath = pathSegments;
            this.navigateTo(routeId, pathSegments);
        }
    }

    getRouteId(pathSegments) {
        // Map path segments to route IDs
        if (pathSegments.length === 0) return 'home-page';
        if (pathSegments.length === 1) {
            switch(pathSegments[0]) {
                case 'a': return 'route-a';
                case 'b': return 'route-b';
                case 'c': return 'route-c';
                case 'about': return 'about-page';
                default: return 'home-page';
            }
        }
        if (pathSegments.length === 2) {
            if (pathSegments[0] === 'a' && pathSegments[1] === 'b') {
                return 'route-a-b';
            }
        }
        if (pathSegments.length === 3) {
            if (pathSegments[0] === 'a' && pathSegments[1] === 'b' && pathSegments[2] === 'c') {
                return 'route-a-b-c';
            }
        }
        return 'home-page';
    }

    navigateTo(routeId, pathSegments) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(routeId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Update main navigation active state
        this.updateMainNavigation(pathSegments);
        
        // Update sub-navigation and breadcrumbs
        this.updateSubNavigation(pathSegments);
        
        this.currentRoute = routeId;
        
        // Initialize route-specific functionality
        this.initRouteFunctionality(routeId);
    }

    updateMainNavigation(pathSegments) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Activate the main route link
        if (pathSegments.length > 0) {
            const mainRoute = pathSegments[0];
            const activeLink = document.querySelector(`[href="#/${mainRoute}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else {
            // Home page
            const homeLink = document.querySelector('[href="#/"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }

    updateSubNavigation(pathSegments) {
        const subNavbar = document.getElementById('sub-navbar');
        const breadcrumb = document.getElementById('breadcrumb');
        const subNavMenu = document.getElementById('sub-nav-menu');
        
        // Show/hide sub-navigation based on route depth
        if (pathSegments.length > 1) {
            subNavbar.style.display = 'block';
            this.updateBreadcrumb(breadcrumb, pathSegments);
            this.updateSubNavMenu(subNavMenu, pathSegments);
        } else {
            subNavbar.style.display = 'none';
        }
    }

    updateBreadcrumb(breadcrumb, pathSegments) {
        breadcrumb.innerHTML = '';
        
        // Add Home link
        const homeItem = document.createElement('span');
        homeItem.className = 'breadcrumb-item';
        homeItem.textContent = 'Home';
        homeItem.onclick = () => this.navigateToPath([]);
        breadcrumb.appendChild(homeItem);
        
        // Add path segments
        pathSegments.forEach((segment, index) => {
            // Add separator
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = ' > ';
            breadcrumb.appendChild(separator);
            
            // Add segment
            const segmentItem = document.createElement('span');
            segmentItem.className = 'breadcrumb-item';
            segmentItem.textContent = this.formatSegmentName(segment);
            
            // Make it clickable if not the last segment
            if (index < pathSegments.length - 1) {
                segmentItem.onclick = () => {
                    const newPath = pathSegments.slice(0, index + 1);
                    this.navigateToPath(newPath);
                };
            } else {
                segmentItem.classList.add('active');
            }
            
            breadcrumb.appendChild(segmentItem);
        });
    }

    updateSubNavMenu(subNavMenu, pathSegments) {
        subNavMenu.innerHTML = '';
        
        // Add sub-navigation based on current route
        if (pathSegments[0] === 'a') {
            if (pathSegments.length === 1) {
                // In route A, show link to B
                const linkB = this.createSubNavLink('B', ['a', 'b'], pathSegments);
                subNavMenu.appendChild(linkB);
            } else if (pathSegments.length === 2 && pathSegments[1] === 'b') {
                // In route A/B, show link to C
                const linkC = this.createSubNavLink('C', ['a', 'b', 'c'], pathSegments);
                subNavMenu.appendChild(linkC);
            }
        }
    }

    createSubNavLink(text, targetPath, currentPath) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#/' + targetPath.join('/');
        link.className = 'sub-nav-link';
        link.textContent = text;
        
        // Check if this is the active sub-route
        if (targetPath.length === currentPath.length && 
            targetPath.every((segment, index) => segment === currentPath[index])) {
            link.classList.add('active');
        }
        
        link.onclick = (e) => {
            e.preventDefault();
            this.navigateToPath(targetPath);
        };
        
        li.appendChild(link);
        return li;
    }

    formatSegmentName(segment) {
        // Convert route segments to display names
        const nameMap = {
            'a': 'Route A',
            'b': 'Route B', 
            'c': 'Route C',
            'about': 'About'
        };
        return nameMap[segment] || segment;
    }

    initRouteFunctionality(routeId) {
        switch(routeId) {
            case 'home-page':
                this.initHomePage();
                break;
            case 'route-a':
                this.initRouteA();
                break;
            case 'route-a-b':
                this.initRouteAB();
                break;
            case 'route-a-b-c':
                this.initRouteABC();
                break;
            case 'route-b':
                this.initRouteB();
                break;
            case 'route-c':
                this.initRouteC();
                break;
            case 'about-page':
                // About page doesn't need special initialization
                break;
        }
    }

    // Home Page Functionality
    initHomePage() {
        const mainHeading = document.getElementById('main-heading');
        const changeHeadingBtn = document.getElementById('change-heading');
        const changeColorBtn = document.getElementById('change-color');
        const contactForm = document.getElementById('contact-form');

        if (!mainHeading || !changeHeadingBtn || !changeColorBtn || !contactForm) return;

        const headings = [
            "Welcome to My Interactive Page",
            "Hello, World!",
            "Interactive Web Page",
            "Click Me Again!",
            "You're Awesome!"
        ];

        const colors = [
            "#f0f2f5",
            "#e3f2fd",
            "#f3e5f5",
            "#e8f5e9",
            "#fff3e0"
        ];

        let headingIndex = 0;
        let colorIndex = 0;

        // Change heading on button click
        changeHeadingBtn.onclick = function() {
            headingIndex = (headingIndex + 1) % headings.length;
            mainHeading.textContent = headings[headingIndex];
            mainHeading.style.color = getRandomColor();
        };

        // Change background color on button click
        changeColorBtn.onclick = function() {
            colorIndex = (colorIndex + 1) % colors.length;
            document.body.style.backgroundColor = colors[colorIndex];
        };

        // Handle form submission
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Show success message
            alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
            
            // Reset form
            this.reset();
        };

        // Helper function to generate random colors
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }

    // Route A Functionality
    initRouteA() {
        // Route A specific functionality can be added here
        console.log('Route A initialized');
    }

    // Route A/B Functionality
    initRouteAB() {
        // Route A/B specific functionality can be added here
        console.log('Route A/B initialized');
    }

    // Route A/B/C Functionality
    initRouteABC() {
        const slider1 = document.getElementById('slider1');
        const sliderValue = document.getElementById('slider-value');
        
        if (slider1 && sliderValue) {
            slider1.oninput = function() {
                sliderValue.textContent = this.value;
            };
        }
        
        console.log('Route A/B/C initialized');
    }

    // Route B - Dashboard Functionality
    initRouteB() {
        const refreshBtn = document.getElementById('refresh-stats');
        const statNumbers = {
            'user-count': { min: 1000, max: 2000, format: 'number' },
            'revenue': { min: 30000, max: 60000, format: 'currency' },
            'order-count': { min: 400, max: 800, format: 'number' },
            'conversion-rate': { min: 1.5, max: 4.0, format: 'percentage' }
        };

        if (!refreshBtn) return;

        refreshBtn.onclick = function() {
            Object.keys(statNumbers).forEach(id => {
                const element = document.getElementById(id);
                const config = statNumbers[id];
                
                if (element) {
                    const newValue = Math.random() * (config.max - config.min) + config.min;
                    let displayValue;
                    
                    switch(config.format) {
                        case 'number':
                            displayValue = Math.floor(newValue).toLocaleString();
                            break;
                        case 'currency':
                            displayValue = '$' + Math.floor(newValue).toLocaleString();
                            break;
                        case 'percentage':
                            displayValue = newValue.toFixed(1) + '%';
                            break;
                    }
                    
                    // Animate the number change
                    element.style.transform = 'scale(1.1)';
                    element.style.color = '#4CAF50';
                    
                    setTimeout(() => {
                        element.textContent = displayValue;
                        element.style.transform = 'scale(1)';
                        element.style.color = '#333';
                    }, 200);
                }
            });
        };
    }

    // Route C - Tools Functionality
    initRouteC() {
        this.initColorPicker();
        this.initTextGenerator();
        this.initTimer();
    }

    initColorPicker() {
        const colorPicker = document.getElementById('color-picker');
        const colorPreview = document.getElementById('color-preview');
        const colorValue = document.getElementById('color-value');

        if (!colorPicker || !colorPreview || !colorValue) return;

        colorPicker.onchange = function() {
            const color = this.value;
            colorPreview.style.backgroundColor = color;
            colorValue.textContent = color;
        };
    }

    initTextGenerator() {
        const generateBtn = document.getElementById('generate-text');
        const textDisplay = document.getElementById('generated-text');

        if (!generateBtn || !textDisplay) return;

        const texts = [
            "The quick brown fox jumps over the lazy dog.",
            "All work and no play makes Jack a dull boy.",
            "To be or not to be, that is the question.",
            "A journey of a thousand miles begins with a single step.",
            "The only way to do great work is to love what you do.",
            "Life is what happens when you're busy making other plans.",
            "Success is not final, failure is not fatal.",
            "The future belongs to those who believe in the beauty of their dreams."
        ];

        generateBtn.onclick = function() {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            textDisplay.style.opacity = '0';
            
            setTimeout(() => {
                textDisplay.textContent = randomText;
                textDisplay.style.opacity = '1';
            }, 200);
        };
    }

    initTimer() {
        const timerDisplay = document.getElementById('timer-display');
        const startBtn = document.getElementById('start-timer');
        const stopBtn = document.getElementById('stop-timer');
        const resetBtn = document.getElementById('reset-timer');

        if (!timerDisplay || !startBtn || !stopBtn || !resetBtn) return;

        let timer = null;
        let seconds = 0;
        let isRunning = false;

        function updateDisplay() {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        startBtn.onclick = function() {
            if (!isRunning) {
                isRunning = true;
                timer = setInterval(() => {
                    seconds++;
                    updateDisplay();
                }, 1000);
            }
        };

        stopBtn.onclick = function() {
            if (isRunning) {
                isRunning = false;
                clearInterval(timer);
            }
        };

        resetBtn.onclick = function() {
            isRunning = false;
            clearInterval(timer);
            seconds = 0;
            updateDisplay();
        };
    }
}

// Initialize the nested router when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const routes = {
        '#/': 'home-page',
        '#/a': 'route-a',
        '#/a/b': 'route-a-b',
        '#/a/b/c': 'route-a-b-c',
        '#/b': 'route-b',
        '#/c': 'route-c',
        '#/about': 'about-page'
    };

    const router = new NestedRouter(routes);
}); 