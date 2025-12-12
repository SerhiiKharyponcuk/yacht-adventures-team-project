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



document.addEventListener("DOMContentLoaded", () => {
  const boat = document.querySelector(".hero__boat-animated");

  // Список декоративних човнів (1x)
  const images = [
    "./images/hero-boat-deco-1.webp",
    "./images/hero-boat-deco-2.webp",
    "./images/hero-boat-deco-3.webp"
  ];

  let index = 0;

  // Функція зміни зображення
  function changeBoatImage() {
    index = (index + 1) % images.length;
    boat.style.backgroundImage = `url(${images[index]})`;
  }

  // Кожні 18 секунд (під fade-анімацію)
  setInterval(changeBoatImage, 18000);
});
