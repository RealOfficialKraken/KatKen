document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('pixelSize');
    const label = document.getElementById('sizeLabel');
    const toggleCat = document.getElementById('toggle-cat');

    function updateLabel(value) {
        label.textContent = `Size: ${value}x`;
    }

    browser.storage.local.get("pixelSize").then(result => {
        let pixelSize = Number(result.pixelSize);
        if (!pixelSize || isNaN(pixelSize)) {
            pixelSize = 1;
            browser.storage.local.set({ pixelSize });
        }
        slider.value = pixelSize;
        updateLabel(pixelSize);
    });

    slider.addEventListener("input", () => {
        const newSize = Number(slider.value);
        updateLabel(newSize);
        browser.storage.local.set({ pixelSize: newSize }).then(() => {
            browser.storage.local.get(null).then(items => {
                console.log("Storage after set:", items);
            });
        });
    });

    browser.storage.local.get('catVisible').then(result => {
        toggleCat.checked = result.catVisible !== false; // default to true
    });

    toggleCat.addEventListener('change', () => {
        browser.storage.local.set({ catVisible: toggleCat.checked });
    });

    const resetButton = document.querySelector('label[for="reset-xy"]') || document.getElementById('reset-xy');

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            browser.storage.local.set({ catPosition: { left: 0, top: 0 } });
        });
    }
});