// Get DOM elements
const mainHeading = document.getElementById('main-heading');
const changeHeadingBtn = document.getElementById('change-heading');
const changeColorBtn = document.getElementById('change-color');
const contactForm = document.getElementById('contact-form');

// Array of possible headings
const headings = [
    "Welcome to My Interactive Page",
    "Hello, World!",
    "Interactive Web Page",
    "Click Me Again!",
    "You're Awesome!"
];

// Array of background colors
const colors = [
    "#f0f2f5",
    "#e3f2fd",
    "#f3e5f5",
    "#e8f5e9",
    "#fff3e0"
];

// Counter for cycling through headings and colors
let headingIndex = 0;
let colorIndex = 0;

// Change heading on button click
changeHeadingBtn.addEventListener('click', () => {
    headingIndex = (headingIndex + 1) % headings.length;
    mainHeading.textContent = headings[headingIndex];
    mainHeading.style.color = getRandomColor();
});

// Change background color on button click
changeColorBtn.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.backgroundColor = colors[colorIndex];
});

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Show success message
    alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
    
    // Reset form
    contactForm.reset();
});

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
} 