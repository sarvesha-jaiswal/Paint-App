const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const resultText = document.getElementById('resultText');

const rightColorPicker = document.getElementById('rightColorPicker');

let isPainting = false;
let lastX = 0;
let lastY = 0;
let selectedColor = null; // Default to no color selected

// Set canvas to full width and height of its container (window in this case)
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8; // 80% of the window width
    canvas.height = window.innerHeight * 0.8; // 80% of the window height
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas when resizing
}

// Initial canvas setup
resizeCanvas();

// Resize the canvas when the window size changes
window.addEventListener('resize', resizeCanvas);

// Event listener for the right color picker
rightColorPicker.addEventListener('input', (e) => {
    selectedColor = e.target.value;
});

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isPainting = false);
canvas.addEventListener('mouseout', () => isPainting = false);
canvas.addEventListener('dblclick', deleteCircle);

resetButton.addEventListener('click', clearCanvas);

function draw(e) {
    if (!isPainting) return;
    ctx.beginPath();
    ctx.arc(lastX, lastY, getCircleSize(e), 0, 2 * Math.PI);

    // Use the selected color with random shade, or random color if none selected
    ctx.fillStyle = selectedColor ? getRandomShade(selectedColor) : getRandomColor();
    ctx.fill();

    [lastX, lastY] = [e.offsetX, e.offsetY];
    displayResult(e);
}

// Generate a random shade based on the selected color
function getRandomShade(hexColor) {
    let { r, g, b } = hexToRgb(hexColor);

    // Slightly modify each RGB channel to create a shade variation
    r = Math.min(255, Math.max(0, r + getRandomInt(-30, 30)));
    g = Math.min(255, Math.max(0, g + getRandomInt(-30, 30)));
    b = Math.min(255, Math.max(0, b + getRandomInt(-30, 30)));

    return `rgb(${r}, ${g}, ${b})`;
}

// Utility function to convert hex color to RGB
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Function to generate a random integer within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get circle size based on distance moved
function getCircleSize(e) {
    const dx = e.offsetX - lastX;
    const dy = e.offsetY - lastY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Generate a random color if no color is selected
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Clear the canvas and reset the color selection
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    selectedColor = null; // Reset color selection to random
}



// Allow double-click to delete a circle (optional feature)
function deleteCircle(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    const imageData = ctx.getImageData(x, y, 1, 1);
    if (imageData.data[3] !== 0) {
        ctx.clearRect(x - 20, y - 20, 40, 40); // Clear the circle
    }
}



