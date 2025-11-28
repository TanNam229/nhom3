document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.querySelector('.user-icon');
    const subMenu = document.querySelector('.sub-menu');
    const userMenuContainer = document.querySelector('.user-menu-container');

    userIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        subMenu.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (!userMenuContainer.contains(event.target) && subMenu.classList.contains('active')) {
            subMenu.classList.remove('active');
        }
    });
});