
const categoryButtons = document.querySelectorAll('.category-btn');
const menuSections = document.querySelectorAll('.menu');

// helper to create slugs from names
function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

menuSections.forEach(section => {
    const items = section.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
        setTimeout(() => item.classList.add('show'), index * 100);
    });
});

// Hide static items that were removed by admin previously
try {
    const removedList = JSON.parse(localStorage.getItem('removedMenuItems') || '[]');
    if (Array.isArray(removedList) && removedList.length > 0) {
        document.querySelectorAll('.menu-item').forEach(item => {
            const t = item.querySelector('h3');
            if (!t) return;
            const s = slugify(t.textContent);
            if (removedList.includes(s)) item.remove();
        });
    }
} catch (e) {
    console.error('Failed to apply removed menu items', e);
}

// Helper to insert a menu item object into the DOM
function insertMenuItemElement(item) {
    // Do not insert if removed
    const removedKey = 'removedMenuItems';
    const removed = JSON.parse(localStorage.getItem(removedKey) || '[]');
    const itemSlug = slugify(item.name);
    if (removed.includes(itemSlug)) return;

    const section = document.querySelector(`.menu[data-category="${item.category}"]`);
    if (!section) return;

    const article = document.createElement('article');
    article.className = 'menu-item';
    article.id = item.id;

    const img = document.createElement('img');
    img.className = 'item-photo';
    img.src = item.image;
    article.appendChild(img);

    const h3 = document.createElement('h3');
    h3.className = 'menu-item-title';
    h3.textContent = item.name;
    article.appendChild(h3);

    const h2 = document.createElement('h2');
    h2.className = 'menu-item-price';
    h2.textContent = `$${(+item.price).toFixed(2)}`;
    article.appendChild(h2);

    const btn = document.createElement('button');
    btn.className = 'btn-order';
    btn.textContent = 'Add to Order';
    btn.addEventListener('click', () => addItem(item.id));
    article.appendChild(btn);

    // Place at end of section
    section.appendChild(article);

    // If admin, attach delete button
    if (!!localStorage.getItem('CurrentAdmin')) {
        const del = document.createElement('button');
        del.className = 'btn-delete-item';
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            if (!confirm('Delete "' + item.name + '" from the menu?')) return;
            const list = JSON.parse(localStorage.getItem(removedKey) || '[]');
            list.push(itemSlug);
            localStorage.setItem(removedKey, JSON.stringify(list));
            article.remove();
        });
        article.style.position = 'relative';
        del.style.position = 'absolute';
        del.style.top = '8px';
        del.style.right = '8px';
        article.appendChild(del);
    }
}

// Load persisted custom menu items (added by admin)
try {
    const storedMenu = JSON.parse(localStorage.getItem('menu') || '[]');
    if (Array.isArray(storedMenu) && storedMenu.length > 0) {
        storedMenu.forEach(mi => {
            // only insert items that don't already exist by id
            if (!document.getElementById(mi.id)) insertMenuItemElement(mi);
        });
    }
} catch (e) {
    console.error('Failed to load stored menu items', e);
}


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
const isAdmin = !!localStorage.getItem('CurrentAdmin');
(function() {
    // only proceed with admin controls if admin
    if (!isAdmin) {
        return;
    }
        // --- Admin: Add item UI ---
        const adminControls = document.createElement('div');
        adminControls.style.display = 'flex';
        adminControls.style.gap = '10px';
        adminControls.style.alignItems = 'center';
        adminControls.style.justifyContent = 'center';
        adminControls.style.margin = '12px';

        const addBtn = document.createElement('button');
        addBtn.className = 'btn';
        addBtn.textContent = 'Add Menu Item';
        adminControls.appendChild(addBtn);

        // Modal form
        const modal = document.createElement('div');
        modal.id = 'admin-add-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '10000';

        const formBox = document.createElement('div');
        formBox.style.background = '#fff';
        formBox.style.padding = '16px';
        formBox.style.borderRadius = '8px';
        formBox.style.width = '420px';

        formBox.innerHTML = `
            <h3>Add Menu Item</h3>
            <label>Name</label>
            <input id="admin-item-name" style="width:100%; padding:8px; margin:6px 0;" />
            <label>Price</label>
            <input id="admin-item-price" style="width:100%; padding:8px; margin:6px 0;" />
            <label>Category</label>
            <select id="admin-item-category" style="width:100%; padding:8px; margin:6px 0;">
                <option value="entrees">Main Event Entrees</option>
                <option value="appetizers">Opening Drive Appetizers</option>
                <option value="sides">The Side Zone</option>
                <option value="pasta">Prime Time Pasta</option>
                <option value="desserts">Championship Treats</option>
                <option value="drinks">Bullpen Beverages</option>
                <option value="alcohol">All Star Sips</option>
            </select>
            <label>Image (choose file)</label>
            <input type="file" id="admin-item-image" accept="image/*" style="width:100%; margin:6px 0;" />
            <div id="admin-add-error" style="color:#ff6b6b;margin-top:6px;"></div>
            <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:10px;">
                <button id="admin-cancel" class="btn">Cancel</button>
                <button id="admin-save" class="btn btn-purchase">Save Item</button>
            </div>
        `;

        modal.appendChild(formBox);
        document.body.appendChild(modal);
        // Insert adminControls below the categories
        const cat = document.querySelector('.menu-categories');
        if (cat && cat.parentNode) cat.parentNode.insertBefore(adminControls, cat.nextSibling);

        addBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
        document.getElementById('admin-cancel').addEventListener('click', (e) => { e.preventDefault(); modal.style.display = 'none'; });

        // Save handler
        document.getElementById('admin-save').addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.getElementById('admin-item-name').value.trim();
            const priceRaw = document.getElementById('admin-item-price').value.trim();
            const category = document.getElementById('admin-item-category').value;
            const fileInput = document.getElementById('admin-item-image');
            const err = document.getElementById('admin-add-error');
            err.textContent = '';

            if (!name) { err.textContent = 'Name is required.'; return; }
            const price = parseFloat(priceRaw.replace('$',''));
            if (isNaN(price)) { err.textContent = 'Valid price is required.'; return; }
            if (!fileInput.files || fileInput.files.length === 0) { err.textContent = 'Please choose an image file.'; return; }

            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(ev) {
                const dataUrl = ev.target.result;
                // create id
                const id = slugify(name) + '-' + Date.now();
                // save into localStorage.menu
                const menuList = JSON.parse(localStorage.getItem('menu') || '[]');
                const item = { id: id, name: name, price: +price.toFixed(2), image: dataUrl, category: category };
                menuList.push(item);
                localStorage.setItem('menu', JSON.stringify(menuList));
                // insert into DOM under matching section
                insertMenuItemElement(item);
                modal.style.display = 'none';
            };
                reader.readAsDataURL(file);
            });

            // Add delete buttons to existing menu items for admins
            document.querySelectorAll('.menu-item').forEach(item => {
                // don't add if already has a delete button
                if (item.querySelector('.btn-delete-item')) return;
                const titleEl = item.querySelector('h3');
                if (!titleEl) return;
                const itemSlug = slugify(titleEl.textContent);
                const del = document.createElement('button');
                del.className = 'btn-delete-item';
                del.textContent = 'Delete';
                del.addEventListener('click', () => {
                    if (!confirm('Delete "' + titleEl.textContent + '" from the menu?')) return;
                    const list = JSON.parse(localStorage.getItem('removedMenuItems') || '[]');
                    list.push(itemSlug);
                    localStorage.setItem('removedMenuItems', JSON.stringify(list));
                    item.remove();
                });
                item.style.position = 'relative';
                del.style.position = 'absolute';
                del.style.top = '8px';
                del.style.right = '8px';
                item.appendChild(del);
            });
        })();

// Handle scroll parameter from About Us page
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const scrollTo = params.get('scroll');
    if (scrollTo) {
        // Find the item with matching name and scroll to it
        const allItems = document.querySelectorAll('.menu-item');
        for (let item of allItems) {
            const titleEl = item.querySelector('h3');
            if (titleEl && titleEl.textContent.trim() === decodeURIComponent(scrollTo)) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                break;
            }
        }
    }
});