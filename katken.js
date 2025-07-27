// KatKen injects an element directly outside of the <body> element.
// This element can be dragged and it's xy coordinate is saved to local storage.
// You can affect the cat's settings in the extension's opetion
// This is made after my kitten Vincent, where I drew the cat's art directly from me looking at him, and him doing cat things.
// THIS MEANS there are no other cats (yet, MAYBE.. Don't get your hopes up.)
// It already took me a lot of work making the spritesheet from hand, and I can rest easy knowing Vinny boy will live forever <3
// He's still alive during this time of writing c:


// Use browser.* if available, otherwise fallback to chrome.*
const ext = typeof browser !== "undefined" ? browser : chrome;
const imageUrl = ext.runtime.getURL('vincent-spritesheet.png');

//add listener for pixel size
ext.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.pixelSize) {
    const newPixelSize = parseFloat(changes.pixelSize.newValue) || 1;
    dragParent.style.setProperty('--pixel-size', newPixelSize);

    //recalculate sprite row offset using the new pixel size and current row
    const spriteHeight = 32;
    //use current row variable, default to 1 if not set
    const row = typeof previousRow !== 'undefined' ? previousRow : 1;
    const newOffset = -1 * spriteHeight * newPixelSize * row;
    draggable.style.setProperty('--sheet-row', `${newOffset}px`);
  }

  if (area === 'local' && changes.catPosition) {
    const newPos = changes.catPosition.newValue;
    dragParent.style.left = `${newPos.left}px`;
    dragParent.style.top = `${newPos.top}px`;
  }

  if (area === 'local' && changes.catVisible) {
    dragParent.style.display = changes.catVisible.newValue ? '' : 'none';
  }
});

//construct the parent element
const dragParent = document.createElement('div');
dragParent.className = 'character';
dragParent.id = 'draggable';

//construct the child element containing the spritesheet
const draggable = document.createElement('div');
draggable.className = 'char-spritesheet';
//draggable.style.backgroundImage = `url('${imageUrl}')`;

//inject construct outside of the <body> element
document.documentElement.insertBefore(dragParent, document.body);
dragParent.appendChild(draggable);

ext.storage.local.get('pixelSize').then(result => {
  const pixelSize = parseFloat(result.pixelSize) || 1;
  dragParent.style.setProperty('--pixel-size', pixelSize);

  const spriteHeight = 32;
  const row = previousRow;
  const initialOffset = -1 * spriteHeight * pixelSize * row;
  draggable.style.setProperty('--sheet-row', `${initialOffset}px`);
});
ext.storage.local.get('catPosition').then((result) => {
  if (result.catPosition) {
    dragParent.style.left = `${result.catPosition.left}px`;
    dragParent.style.top = `${result.catPosition.top}px`;
  }
});
ext.storage.local.get('catVisible').then(result => {
    if (result.catVisible === false) {
        dragParent.style.display = 'none';
    } else {
        dragParent.style.display = '';
    }
});

//declare vars
let isDragging = false;
let didDrag = false;
let offsetX = 0;
let offsetY = 0;
let previousRow = 1; // <-- set to 1 instead of -1
let resetTimeoutId = null;
let resetTimeoutIdIdle = null;
let idleTimer = 3700; //Vinny boy sit and watch your mouse (kinda :P)
let sleepTimer = 60000; //always keep this shorter than the Idle Timer

//listen for dragging, set drag vars to ensure the anim doesn't play
draggable.addEventListener('mousedown', (e) => {
  didDrag = false;
  isDragging = true;
  offsetX = e.clientX - dragParent.offsetLeft;
  offsetY = e.clientY - dragParent.offsetTop;
});

//If it's dragging, say it's dragging, then move to wherever the mouse is.
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    didDrag = true;

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    //const current window border vars
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    //prevent the user from dragging the div outside the window borders
    newX = Math.min(Math.max(0, newX), windowWidth - dragParent.offsetWidth);
    newY = Math.min(Math.max(0, newY), windowHeight - dragParent.offsetHeight);

    dragParent.style.left = newX + 'px';
    dragParent.style.top = newY + 'px';
    ext.storage.local.set({ catPosition: { left: newX, top: newY } });
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
    const pixelSize = parseFloat(getComputedStyle(dragParent).getPropertyValue('--pixel-size')) || 1;
    const spriteHeight = 32;
    const idleOffset = -1 * spriteHeight * pixelSize * 1; // row 1
    draggable.style.setProperty('--sheet-row', `${idleOffset}px`);
    previousRow = 1;
    resetTimeoutIdIdle = null;
  }, idleTimer);

  resetTimeoutId = setTimeout(() => {
    const pixelSize = parseFloat(getComputedStyle(dragParent).getPropertyValue('--pixel-size')) || 1;
    const spriteHeight = 32;
    draggable.style.setProperty('--sheet-row', '0px');
    previousRow = 0;
    resetTimeoutId = null;
  }, sleepTimer);

  let newRow;
  do {
    newRow = 2 + Math.floor(Math.random() * 2);
  } while (newRow === previousRow);

  //set sprite sheet row depending on pixel size
  previousRow = newRow;
  const pixelSize = parseFloat(getComputedStyle(dragParent).getPropertyValue('--pixel-size')) || 1;
  const spriteHeight = 32;
  const newOffset = -1 * spriteHeight * pixelSize * newRow;
  draggable.style.setProperty('--sheet-row', `${newOffset}px`);
});

//idle timer code
resetTimeoutId = setTimeout(() => {
    draggable.style.setProperty('--sheet-row', '0px');
    previousRow = 0;
    resetTimeoutId = null;
  }, sleepTimer);



//log the storage values to the console at all times
ext.storage.local.get(null).then(items => {
  console.log("KatKen storage contents:", items);
}).catch(err => {
  console.error("Error reading storage:", err);
});

function getStorage(keys) {
    return new Promise((resolve) => {
        ext.storage.local.get(keys, resolve);
    });
}
function setStorage(items) {
    return new Promise((resolve) => {
        ext.storage.local.set(items, resolve);
    });
}
