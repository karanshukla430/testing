$(document).ready(function() {
    // Get DOM elements
    const mainHeading = $('#main-heading');
    const changeHeadingBtn = $('#change-heading');
    const changeColorBtn = $('#change-color');
    const contactForm = $('#contact-form');

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
    changeHeadingBtn.on('click', function() {
        headingIndex = (headingIndex + 1) % headings.length;
        mainHeading.text(headings[headingIndex]);
        mainHeading.css('color', getRandomColor());
    });

    // Change background color on button click
    changeColorBtn.on('click', function() {
        colorIndex = (colorIndex + 1) % colors.length;
        $('body').css('backgroundColor', colors[colorIndex]);
    });

    // Handle form submission
    contactForm.on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#name').val();
        const email = $('#email').val();
        const message = $('#message').val();
        
        // Show success message
        alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);
        
        // Reset form
        this.reset();
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
}); 