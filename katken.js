// Create the draggable div
const dragParent = document.createElement('div');
dragParent.className = 'character'
dragParent.id = 'draggable';

const draggable = document.createElement('div');
draggable.className = 'char-spritesheet'

document.documentElement.insertBefore(dragParent, document.body);
dragParent.appendChild(draggable);

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

draggable.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - dragParent.offsetLeft;
  offsetY = e.clientY - dragParent.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // Get the viewport dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Prevent dragging the div outside the window bounds
    newX = Math.min(Math.max(0, newX), windowWidth - dragParent.offsetWidth);
    newY = Math.min(Math.max(0, newY), windowHeight - dragParent.offsetHeight);

    dragParent.style.left = newX + 'px';
    dragParent.style.top = newY + 'px';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});