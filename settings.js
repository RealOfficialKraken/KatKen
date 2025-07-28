document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('pixelSize');
    const label = document.getElementById('sizeLabel');
    const toggleCat = document.getElementById('toggle-cat');
    const debugMenu = document.getElementById('debug-menu');
    const debugSwitch = document.getElementById('in-debug');
    const debugContent = document.getElementById('dmenu');

    function updateLabel(value) {
        label.textContent = `Size: ${value}x`;
    }

    //debug menu keydown listener
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'd') {
            if (debugMenu.style.display === 'flex') {
                debugMenu.style.display = 'none';
            } else {
                debugMenu.style.display = 'flex';
            }
        }
    });

    ext.storage.local.get("pixelSize").then(result => {
        let pixelSize = Number(result.pixelSize);
        if (!pixelSize || isNaN(pixelSize)) {
            pixelSize = 1;
            ext.storage.local.set({ pixelSize });
        }
        slider.value = pixelSize;
        updateLabel(pixelSize);
    });

    slider.addEventListener("input", () => {
        const newSize = Number(slider.value);
        updateLabel(newSize);
        ext.storage.local.set({ pixelSize: newSize }).then(() => {
            ext.storage.local.get(null).then(items => {
                console.log("Storage after set:", items);
            });
        });
    });

    ext.storage.local.get('catVisible').then(result => {
        toggleCat.checked = result.catVisible !== false; // default to true
    });

    toggleCat.addEventListener('change', () => {
        ext.storage.local.set({ catVisible: toggleCat.checked });
    });

    const resetButton = document.querySelector('label[for="reset-xy"]') || document.getElementById('reset-xy');
    const draggable = document.querySelector('.char-spritesheet');

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            ext.storage.local.set({ catPosition: { left: 0, top: 0 } });
        });
    }

    // Show/hide debug content when switch is toggled
    debugSwitch.addEventListener('change', () => {
        if (debugSwitch.checked) {
            debugContent.style.display = 'flex';
            draggable.style.border = '2px solid red';
            draggable.style.overflow = 'visible';
        } else {
            debugContent.style.display = 'none';
            draggable.style.border = 'none';
            draggable.style.overflow = 'hidden';
        }
    });

    // Set initial state on load
    if (debugSwitch.checked) {
        debugContent.style.display = 'flex';
        draggable.style.border = '2px solid red';
        draggable.style.overflow = 'visible';
    } else {
        debugContent.style.display = 'none';
        draggable.style.border = 'none';
        draggable.style.overflow = 'hidden';
    }
});

// Use browser.* if available, otherwise fallback to chrome.*
const ext = typeof browser !== "undefined" ? browser : chrome;