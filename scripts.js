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
    // Define gradient color pairs
    const gradients = [
        ['#FF5E5E', '#FFB443'], // Red to Orange
        ['#7ED957', '#43FFD5'], // Green to Turquoise
        ['#5EA8FF', '#8B75FF'], // Blue to Purple
        ['#FFB443', '#FF6B9D'], // Orange to Pink
        ['#E174FF', '#5ACDFF'], // Purple to Light Blue
        ['#FFE345', '#FF6B9D'], // Yellow to Pink
        ['#43FFD5', '#5EA8FF'], // Turquoise to Blue
        ['#FF6B9D', '#8B75FF']  // Pink to Purple
    ];
    
    const getRandomGradients = () => {
        return [...gradients]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
    };
    
    const getRandomPoint = () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 70 + Math.random() * 60,
        rotation: Math.random() * 360
    });

    // Generate unique IDs for each gradient to prevent SVG ID conflicts
    const uniqueId = Math.random().toString(36).substr(2, 9);

    const shapes = Array(2).fill(null).map((_, index) => {
        const point = getRandomPoint();
        const [color1, color2] = getRandomGradients()[0];
        
        // Create unique path for each blob
        const blobPath = index === 0 
            ? 'M31.5,-26.5C38.9,-22.6,41.5,-11.3,40.3,-1.2C39.1,8.9,34.1,17.8,26.7,21.7C19.2,25.5,9.6,24.3,-1.2,25.5C-12,26.7,-24.1,30.3,-31.8,26.4C-39.5,22.4,-42.9,11.2,-41.4,1.4C-40,-8.3,-33.8,-16.6,-26.1,-20.5C-18.3,-24.4,-9.2,-23.8,1.1,-24.9C11.3,-26,24.1,-30.5,31.5,-26.5Z'
            : 'M20.7,-23.4C27.5,-15.3,34.2,-7.7,35.1,1.0C36.1,9.6,31.4,19.3,24.6,23.9C17.8,28.5,8.9,28.1,0.2,27.9C-8.5,27.7,-17,27.7,-23.7,23.1C-30.4,18.5,-35.3,9.3,-36.4,-1.1C-37.4,-11.5,-34.5,-23,-27.3,-31.1C-20.1,-39.2,-10,-43.9,-1.2,-42.7C7.7,-41.5,15.4,-34.4,20.7,-23.4Z';
        
        const shapeStyles = `
            position: absolute;
            transform: translate(-50%, -50%) rotate(${point.rotation}deg);
            left: ${point.x}%;
            top: ${point.y}%;
            width: ${point.size}%;
            height: ${point.size}%;
            opacity: 0.8;
            animation: float${index + 1} 8s ease-in-out infinite;
        `;

        return `
            <svg style="${shapeStyles}" viewBox="-50 -50 100 100">
                <defs>
                    <linearGradient id="gradient${uniqueId}${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color1}" />
                        <stop offset="100%" style="stop-color:${color2}" />
                    </linearGradient>
                </defs>
                <path d="${blobPath}" fill="url(#gradient${uniqueId}${index})" />
            </svg>`;
    }).join('');

    return `
        <div class="shapes-bg">${shapes}</div>
        <div class="noise-layer"></div>
    `;
}

// Generate slides
const scrollContainer = document.getElementById('scrollContainer');
scrollContainer.innerHTML = Array.from({length: 24}, (_, i) => {
    return `
        <div class="slide" data-day="${i + 1}">
            <div class="container">
                <div class="calendar-day" data-day="${i + 1}">
                    ${generateShapes()}
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