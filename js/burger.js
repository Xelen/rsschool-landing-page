window.addEventListener('DOMContentLoaded', () => {
    const topmenu = document.querySelector('#top-menu'),
        topMenuItem = document.querySelectorAll('.top-link'),
        topMenuItemLink = document.querySelectorAll('.top-link a'),
        burger = document.querySelector('.menu-burger');
    // menuLink = document.querySelector('#menu-link');

    topMenuItemLink.forEach(item => {
        item.classList.add('burger-link');
    });

    function toggleMenu() {
        burger.classList.toggle('burger-active');
        topmenu.classList.toggle('topmenu-active');

        // Body scroll off
        if (burger.classList.contains('burger-active')) {
            document.body.style.overflow = 'hidden';
            // topmenu.querySelector('#top-menu > ul').after(menuLink);

        } else {
            document.body.style.overflow = '';
            // document.querySelector('.inner').appendChild(menuLink);
        }
    }

    burger.addEventListener('click', toggleMenu);

    topMenuItem.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('burger-active');
            topmenu.classList.remove('topmenu-active');

            // Body scroll on
            document.body.style.overflow = '';
            // document.querySelector('.inner').appendChild(menuLink);
        });
    });
});
