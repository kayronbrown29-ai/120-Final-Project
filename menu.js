
const categoryButtons = document.querySelectorAll('.category-btn');
const menuSections = document.querySelectorAll('.menu');

menuSections.forEach(section => {
    const items = section.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
        setTimeout(() => item.classList.add('show'), index * 100);
    });
});


categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');

        menuSections.forEach(section => {
            const items = section.querySelectorAll('.menu-item');

            if (category === 'all' || section.getAttribute('data-category') === category) {
                section.classList.remove('hide');
                items.forEach((item, index) => {
                    item.classList.remove('show');
                    setTimeout(() => item.classList.add('show'), index * 100);
                });
            } else {
                section.classList.add('hide');
                items.forEach(item => item.classList.remove('show'));
            }
        });
    });
});

// --- Admin delete-item functionality ---
(function() {
    // helper to slugify item titles
    function slugify(text) {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
    }

    const removedKey = 'removedMenuItems';
    const removed = JSON.parse(localStorage.getItem(removedKey) || '[]');

    // Hide already-removed items
    document.querySelectorAll('.menu-item').forEach(item => {
        const titleEl = item.querySelector('h3');
        if (!titleEl) return;
        const id = slugify(titleEl.textContent);
        if (removed.includes(id)) {
            item.remove();
        }
    });

    const isAdmin = !!localStorage.getItem('CurrentAdmin');
    if (!isAdmin) return; // only show delete buttons to admins

    // Add delete buttons
    document.querySelectorAll('.menu-item').forEach(item => {
        const titleEl = item.querySelector('h3');
        if (!titleEl) return;
        const id = slugify(titleEl.textContent);

        const del = document.createElement('button');
        del.className = 'btn-delete-item';
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            if (!confirm('Delete "' + titleEl.textContent + '" from the menu?')) return;
            // persist
            const list = JSON.parse(localStorage.getItem(removedKey) || '[]');
            list.push(id);
            localStorage.setItem(removedKey, JSON.stringify(list));
            // remove from DOM
            item.remove();
        });

        // place button at top-right of item
        item.style.position = 'relative';
        del.style.position = 'absolute';
        del.style.top = '8px';
        del.style.right = '8px';
        item.appendChild(del);
    });
})();

