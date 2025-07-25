// Create the draggable div
const dragParent = document.createElement('div');
dragParent.className = 'character'
dragParent.id = 'draggable';

const draggable = document.createElement('div');
draggable.className = 'char-spritesheet'

document.documentElement.insertBefore(dragParent, document.body);
dragParent.appendChild(draggable);

let isDragging = false;
let didDrag = false;
let offsetX = 0;
let offsetY = 0;
let previousRow = -1;
let resetTimeoutId = null; // Store timeout reference here
let resetTimeoutIdIdle = null; // Store timeout reference here
let idleTimer = 3700;
let sleepTimer = 60000; //always keep this shorter than the Idle Timer

draggable.addEventListener('mousedown', (e) => {
  didDrag = false;
  isDragging = true;
  offsetX = e.clientX - dragParent.offsetLeft;
  offsetY = e.clientY - dragParent.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    didDrag = true;

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

dragParent.addEventListener('click', () => {
  if (isDragging) return;
  if (didDrag) return;

  draggable.style.animation = 'none';

  draggable.offsetHeight;

  draggable.style.animation = 'moveSpritesheet 4s steps(10) infinite';

  const randomFacing = Math.random() < 0.5 ? -1 : 1;
  dragParent.style.setProperty('--facing', randomFacing);

  if (resetTimeoutId) {
    clearTimeout(resetTimeoutId);
    resetTimeoutId = null;
  }

  if (resetTimeoutIdIdle) {
    clearTimeout(resetTimeoutIdIdle);
    resetTimeoutId = null;
  }

  resetTimeoutIdIdle = setTimeout(() => {
    draggable.style.setProperty('--sheet-row', '-96px');
    previousRow = 1;
    resetTimeoutIdIdle = null;
  }, idleTimer);
  resetTimeoutId = setTimeout(() => {
    draggable.style.setProperty('--sheet-row', '0px');
    previousRow = 0;
    resetTimeoutId = null;
  }, sleepTimer);

  let newRow;
  
  //do {
  //  newRow = Math.floor(Math.random() * 2) + 1
  //} while (newRow === previousRow);

  newRow = 2;

  previousRow = newRow;
  const newOffset = -96 * newRow;
  draggable.style.setProperty('--sheet-row', `${newOffset}px`);
});

resetTimeoutId = setTimeout(() => {
    draggable.style.setProperty('--sheet-row', '0px');
    previousRow = 0;
    resetTimeoutId = null;
  }, sleepTimer);
