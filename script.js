// SVGs for the Toggle Icon
const sunIcon = `<path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />`;
const moonIcon = `<path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />`;

const htmlEl = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// 1. Handle Dark Mode Toggle & Sync System Preferences
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to system preferences if no choice is saved
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
        htmlEl.setAttribute('data-theme', 'dark');
        themeIcon.innerHTML = sunIcon;
    } else {
        htmlEl.setAttribute('data-theme', 'light');
        themeIcon.innerHTML = moonIcon;
    }
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    if (currentTheme === 'light') {
        htmlEl.setAttribute('data-theme', 'dark');
        themeIcon.innerHTML = sunIcon;
        localStorage.setItem('theme', 'dark');
    } else {
        htmlEl.setAttribute('data-theme', 'light');
        themeIcon.innerHTML = moonIcon;
        localStorage.setItem('theme', 'light');
    }
});

// Run theme detection on load
initTheme();


// 2. Calculator Logic Engine
document.getElementById('pregnancyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculatePregnancy();
});

document.getElementById('resetBtn').addEventListener('click', function() {
    const resultsCard = document.getElementById('resultsCard');
    resultsCard.classList.add('hidden');
});

function calculatePregnancy() {
    const lmpInput = document.getElementById('lmpDate').value;
    if (!lmpInput) return;

    // Split date configuration array manually to eliminate local timezone offsets
    const [year, month, day] = lmpInput.split('-');
    const lmpDate = new Date(year, month - 1, day);
    const today = new Date();
    
    today.setHours(0,0,0,0);
    lmpDate.setHours(0,0,0,0);

    // Calculate Due Date (280 Days / 40 Weeks standard timeline)
    const totalPregnancyMs = 280 * 24 * 60 * 60 * 1000;
    const dueDate = new Date(lmpDate.getTime() + totalPregnancyMs);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dueDate').innerText = dueDate.toLocaleDateString('en-US', options);

    // Calculate Current Growth & Gestational Progression Metrics
    const timeDifference = today.getTime() - lmpDate.getTime();
    const daysPregnant = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let gestationalAgeText = "";
    let progressPercentage = 0;

    if (daysPregnant < 0) {
        gestationalAgeText = "LMP date cannot be in the future!";
        progressPercentage = 0;
    } else if (daysPregnant > 294) {
        gestationalAgeText = "Past your estimated due date window.";
        progressPercentage = 100;
    } else {
        const weeks = Math.floor(daysPregnant / 7);
        const days = daysPregnant % 7;
        
        let trimesterStr = "1st Trimester";
        if (weeks >= 13 && weeks < 27) trimesterStr = "2nd Trimester";
        if (weeks >= 27) trimesterStr = "3rd Trimester";

        gestationalAgeText = `${weeks} Weeks, ${days} Days (${trimesterStr})`;
        progressPercentage = Math.min(Math.round((daysPregnant / 280) * 100), 100);
    }

    document.getElementById('gestationalAge').innerText = gestationalAgeText;
    
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progressPercentage}%`;

    const resultsCard = document.getElementById('resultsCard');
    resultsCard.classList.remove('hidden');
}
