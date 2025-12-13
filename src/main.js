import './js/loader';
import './js/form';
import './js/burger';
import ResponsiveSlider from './js/slider';

const initSlider = () => {
    if (document.querySelector('.slider')) {
        new ResponsiveSlider('.slider');
        console.log("Slider object successfully created.");
    } else {
        console.warn("Element with selector '.slider' not found in the DOM.");
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
} else {
    initSlider();
}

// yacht animation
  document.addEventListener('DOMContentLoaded', () => {
    const boat = document.querySelector('.hero-card__image-inner');

    if (!boat) return;

    let isDecor = false;

    setInterval(() => {
      isDecor = !isDecor;
      boat.classList.toggle('is-decor', isDecor);
    }, 10000); // кожні 10 секунди
  });