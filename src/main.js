import './js/loader';
import './js/form';
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