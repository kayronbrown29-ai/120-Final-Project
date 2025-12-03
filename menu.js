
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

