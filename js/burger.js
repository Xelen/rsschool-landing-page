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
        // scroll to top - menu is opened
        if (burger.classList.contains('burger-active')) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });

    topMenuItemLink.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            setTimeout(function () {
                window.location = item.href;
            }, 500);
            document.body.style.overflow = '';
            burger.classList.remove('burger-active');
            topmenu.classList.remove('topmenu-active');

            // Body scroll on
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
});

window.addEventListener('resize', () => {
    const topmenu = document.querySelector('#top-menu');
    const offset = 90;
    topmenu.style.top = offset + 'px';
});

// apply indentation when page loads
window.dispatchEvent(new Event('resize'));

// scroll styles
const menuContent = document.querySelector('#top-menu');
if (menuContent) {
    menuContent.style.maxHeight = 'calc(100vh - 90px)'; // indentation
    menuContent.style.overflowY = 'auto';
}