window.addEventListener('DOMContentLoaded', () => {
    const topmenu = document.querySelector('#top-menu'),
        topMenuItem = document.querySelectorAll('#top-menu > ul > li'),
        burger = document.querySelector('.menu-burger');

    function toggleMenu() {
        burger.classList.toggle('burger-active');
        topmenu.classList.toggle('topmenu-active');

        // Body scroll off
        if (burger.classList.contains('burger-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    burger.addEventListener('click', toggleMenu);

    topMenuItem.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('burger-active');
            topmenu.classList.remove('topmenu-active');

            // Body scroll on
            document.body.style.overflow = '';
        });
    });
});
