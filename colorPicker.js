const paintCanvas = document.getElementById('paintCanvas');
const colorNotification = document.getElementById('colorNotification');

// Prevent the default context menu from showing
paintCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    // Get the color of the pixel under the mouse
    const x = e.offsetX;
    const y = e.offsetY;
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = imageData.data;

    // Check if the alpha channel is not transparent
    if (a !== 0) {
        const hexColor = rgbToHex(r, g, b);
        copyToClipboard(hexColor);
        showNotification(`Copied color: ${hexColor}`); // Show notification
    } else {
        showNotification("No color found at this pixel.");
    }
});

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Function to copy text to the clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Color copied to clipboard:', text);
    }).catch(err => {
        console.error('Could not copy color: ', err);
    });
}

// Function to show notification
function showNotification(message) {
    colorNotification.innerText = message;
    colorNotification.classList.add('show'); // Show notification
    setTimeout(() => {
        colorNotification.classList.remove('show'); // Hide after 3 seconds
    }, 3000);
}
