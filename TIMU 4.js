// TIMU 4.js

// Menu Elements
const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');

// Menu functionality
menuButton.addEventListener('click', function() {
    menuDropdown.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuDropdown.classList.remove('show');
    }
});

// Close menu on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        menuDropdown.classList.remove('show');
    }
});

// DOM Elements
const plateInput = document.getElementById('plate-input');
const continueBtn = document.getElementById('continue-btn');
const clearBtn = document.getElementById('clear-btn');
const keys = document.querySelectorAll('.key');
const successMessage = document.getElementById('success-message');
const countdownElement = document.getElementById('countdown');
const validPlate = "RAD123A";

// Audio Elements
const keySound = document.getElementById('key-sound');
const successSound = document.getElementById('success-sound');
const celebrationSound = document.getElementById('celebration-sound');

// Speech Synthesis
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();
utterance.lang = 'rw-RW';
utterance.rate = 0.9;

// Focus input field on page load
plateInput.focus();

// Validate plate number
function validatePlate() {
    const currentInput = plateInput.value.toUpperCase();
    const isValid = currentInput === validPlate;

    // Update input styling
    plateInput.classList.remove('valid', 'invalid');
    if (currentInput.length > 0) {
        plateInput.classList.add(isValid ? 'valid' : 'invalid');
    }

    // Update continue button state
    continueBtn.style.opacity = isValid ? "1" : "0.5";
    continueBtn.style.pointerEvents = isValid ? "auto" : "none";
    continueBtn.style.cursor = isValid ? "pointer" : "not-allowed";

    // Trigger celebration if valid
    if (isValid) {
        startCelebration();
    }

    return isValid;
}

// Celebration functions
function createConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#fff'];
    const shapes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random shape
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.borderLeft = '8px solid transparent';
            confetti.style.borderRight = '8px solid transparent';
            confetti.style.borderBottom = `15px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
            confetti.style.background = 'transparent';
        }

        confetti.style.width = (shape === 'triangle' ? '0' : Math.random() * 15 + 5 + 'px');
        confetti.style.height = (shape === 'triangle' ? '0' : Math.random() * 15 + 5 + 'px');
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';

        document.body.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function playSuccessSounds() {
    // Play success sound
    successSound.currentTime = 0;
    successSound.play().catch(e => console.log("Success sound failed:", e));

    // Play celebration sound
    celebrationSound.currentTime = 0;
    celebrationSound.play().catch(e => console.log("Celebration sound failed:", e));

    // Speak confirmation
    utterance.text = "Plaka yemewe neza!";
    synth.speak(utterance);
}

function startCelebration() {
    // Show success message
    successMessage.style.display = 'block';

    // Play all celebration sounds
    playSuccessSounds();

    // Create confetti
    createConfetti();

    // Start countdown
    let count = 5;
    countdownElement.textContent = count;

    const countdown = setInterval(() => {
        count--;
        countdownElement.textContent = count;

        if (count <= 0) {
            clearInterval(countdown);
            // Redirect to next page
            window.location.href = "TIMU-6.html";
        }
    }, 1000);
}

// Handle key press from on-screen keyboard
keys.forEach(key => {
    key.addEventListener('click', () => {
        const keyValue = key.getAttribute('data-key');

        // Play key press sound
        keySound.currentTime = 0;
        keySound.play().catch(e => console.log("Key sound failed:", e));

        // Add key press animation
        key.style.transform = 'translateY(4px)';
        key.style.boxShadow = '0 2px 0 var(--keyboard-accent)';
        setTimeout(() => {
            key.style.transform = '';
            key.style.boxShadow = '';
        }, 100);

        // Handle different key types
        if (keyValue === ' ') {
            if (plateInput.value.length < 7) {
                plateInput.value += ' ';
            }
        } else if (keyValue === 'Backspace') {
            plateInput.value = plateInput.value.slice(0, -1);
        } else {
            if (plateInput.value.length < 7) {
                plateInput.value += keyValue;
            }
        }

        // Validate and move focus back to input
        plateInput.focus();
        validatePlate();
    });
});

// Handle physical keyboard input
plateInput.addEventListener('input', function(e) {
    // Automatically convert to uppercase
    this.value = this.value.toUpperCase();
    validatePlate();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Focus input field when typing starts
    if (e.key.length === 1 && e.target !== plateInput) {
        plateInput.focus();
    }

    // Prevent default for keys we handle specially
    if (e.key === 'Backspace' || e.key === ' ') {
        e.preventDefault();

        // Simulate clicking the corresponding on-screen key
        const keyToPress = e.key === ' ' ? ' ' : 'Backspace';
        const keyElement = document.querySelector(`.key[data-key="${keyToPress}"]`);
        if (keyElement) {
            keyElement.click();
        }
    }
});

// Clear button functionality
clearBtn.addEventListener('click', () => {
    plateInput.value = '';
    plateInput.classList.remove('valid', 'invalid');
    plateInput.focus();
    validatePlate();

    // Add button press animation
    clearBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clearBtn.style.transform = '';
    }, 100);
});

// Continue button click handler
continueBtn.addEventListener('click', (e) => {
    if (!validatePlate()) {
        e.preventDefault();
        alert(`Plaka ntibahuye! Plaka igomba kuba "${validPlate}" gusa.`);
    }
});

// Initial validation
validatePlate();