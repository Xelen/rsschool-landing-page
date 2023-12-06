window.addEventListener('DOMContentLoaded', () => {
    const topmenu = document.querySelector('#top-menu'),
        topMenuItem = document.querySelectorAll('.top-link'),
        topMenuItemLink = document.querySelectorAll('.top-link a'),
        burger = document.querySelector('.menu-burger');

    topMenuItemLink.forEach(item => {
        item.classList.add('burger-link');
    });

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

    burger.addEventListener('click', () => {
        toggleMenu();
        // scroll to top when menu is opened
        if (burger.classList.contains('burger-active')) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });

    topMenuItem.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('burger-active');
            topmenu.classList.remove('topmenu-active');

            // Body scroll on
            document.body.style.overflow = '';
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
});
