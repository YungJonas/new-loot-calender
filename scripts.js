const surprises = {
    titles: [
        "Let the Countdown Begin!", "Christmas Shopping Time!", "Deck the Halls!",
        "Hot Cocoa Day!", "Christmas Movie Marathon!", "Write a Letter to Santa",
        "Ugly Sweater Day!", "Secret Santa Begins", "Holiday Bake Off!",
        "Gift Wrapping Time", "Singing Christmas Carols", "DIY Christmas Decorations",
        "Enjoy a Cozy Fireplace!", "Christmas Tree Shopping", "Candy Cane Hunt!",
        "Go Ice Skating!", "Christmas Light Tour", "Donate Toys to Charity",
        "Make a Gingerbread House", "Write Christmas Cards", "Gift Shopping Finale",
        "Plan Christmas Dinner", "Wrap Last-Minute Gifts", "Christmas Eve Magic!"
    ]
};

function generateShapes() {
    const colors = [
        '#FF5E5E', '#7ED957', '#5EA8FF', '#FFB443', '#E174FF', 
        '#43FFD5', '#FF6B9D', '#5ACDFF', '#FFE345', '#8B75FF'
    ];
    
    // Get 3 random colors
    const selectedColors = [...colors]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    // Generate random positions and sizes for shapes
    const getRandomPoint = () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        // Increased size to accommodate larger blur
        size: 60 + Math.random() * 80
    });

    // Create div elements for each shape with increased blur
    const shapes = selectedColors.map((color, index) => {
        const point = getRandomPoint();
        
        // Increased blur to 25px
        const shapeStyles = `
            position: absolute;
            transform: translate(-50%, -50%);
            left: ${point.x}%;
            top: ${point.y}%;
            background-color: ${color};
            filter: blur(25px);
            -webkit-filter: blur(25px);
            opacity: 0.8;
        `;

        switch (index % 3) {
            case 0: // Circle
                return `<div style="${shapeStyles}
                    width: ${point.size}%;
                    height: ${point.size}%;
                    border-radius: 50%;"></div>`;
            case 1: // Square
                return `<div style="${shapeStyles}
                    width: ${point.size}%;
                    height: ${point.size}%;"></div>`;
            case 2: // Ellipse
                return `<div style="${shapeStyles}
                    width: ${point.size}%;
                    height: ${point.size * 0.6}%;
                    border-radius: 50%;"></div>`;
        }
    }).join('');

    return `<div class="shapes-container">${shapes}</div>`;
}

// Generate slides with abstract backgrounds
const scrollContainer = document.getElementById('scrollContainer');
scrollContainer.innerHTML = Array.from({length: 24}, (_, i) => {
    return `
        <div class="slide" data-day="${i + 1}">
            <div class="container">
                <div class="calendar-day" data-day="${i + 1}">
                    <div class="shape-background">
                        ${generateShapes()}
                    </div>
                    <div class="day-content">
                        <h2>December ${i + 1}</h2>
                        <p>Click to open your surprise!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}).join('');    


// Modal functionality
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const currentDayElement = document.getElementById('currentDay');
let currentDay = 1;

document.addEventListener('click', e => {
    const day = e.target.closest('.calendar-day')?.dataset.day;
    if (day) {
        modalTitle.textContent = surprises.titles[day - 1];
        modalImage.src = `/api/placeholder/500/300`;
        modal.classList.add('active');
    } else if (e.target === modal || e.target.classList.contains('close-modal')) {
        modal.classList.remove('active');
    }
});

// Intersection Observer for slides
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const day = parseInt(entry.target.dataset.day);
            if (day !== currentDay) {
                currentDayElement.classList.add('changing');
                setTimeout(() => {
                    currentDay = day;
                    currentDayElement.textContent = day;
                    currentDayElement.classList.remove('changing');
                }, 100);
            }
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.7 });

document.querySelectorAll('.slide').forEach(slide => observer.observe(slide));

// Smooth scroll behavior
scrollContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    scrollContainer.scrollBy({
        top: delta,
        behavior: 'smooth'
    });
}, { passive: false });