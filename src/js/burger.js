const burger = document.querySelector('.burger');
const menu = document.getElementById('mobile-menu');
const closeBtn = document.querySelector('.mobile-menu__close');
const links = document.querySelectorAll('.mobile-menu__link');

function openMenu() {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

burger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);

links.forEach(link =>
    link.addEventListener('click', closeMenu)
);
