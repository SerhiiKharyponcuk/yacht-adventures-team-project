export default class ResponsiveSlider {
  constructor(selector) {
    this.slider = document.querySelector(selector);
    if (!this.slider) return;

    this.sliderList = document.querySelector(selector + ' .slider-list');
    this.items = document.querySelectorAll(selector + ' .slider-list__item');
    this.paginationDots = document.querySelectorAll(
      selector + ' .slider-pagination-list__item'
    );

    if (!this.sliderList) {
      console.error(
        'Critical Error: Element .slider-list not found inside .slider. Check HTML.'
      );
      return;
    }

    this.currentIndex = 0;
    this.itemWidth = 0;
    this.gap = 0;
    this.maxIndex = 0;
    this.isActive = true;

    this.isDragging = false;
    this.startPos = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    this.currentPosition = 0;

    this.boundTouchMove = this.touchMove.bind(this);
    this.boundTouchEnd = this.touchEnd.bind(this);
    this.boundAnimation = this.animation.bind(this);

    this.init();
  }

  init() {
    this.updateMetrics();
    this.addEventListeners();
    this.goToSlide(this.currentIndex, false);

    window.addEventListener('resize', () => {
      this.updateMetrics();
      this.goToSlide(this.currentIndex);
    });
  }

  addEventListeners() {
    if (this.paginationDots && this.paginationDots.length > 0) {
      this.paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          if (!this.isActive) return;
          this.goToSlide(index);
        });
      });
    }

    this.sliderList.addEventListener('touchstart', this.touchStart.bind(this), {
      passive: true,
    });
    this.sliderList.addEventListener('touchmove', this.boundTouchMove, {
      passive: false,
    });
    this.sliderList.addEventListener('touchend', this.boundTouchEnd);

    this.sliderList.addEventListener('mousedown', this.touchStart.bind(this));
    this.sliderList.addEventListener('mousemove', this.boundTouchMove);
    this.sliderList.addEventListener('mouseup', this.boundTouchEnd);
    this.sliderList.addEventListener('mouseleave', this.boundTouchEnd);

    this.sliderList.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
  }

  updateMetrics() {
    if (this.items.length === 0) return;

    this.itemWidth = this.items[0].offsetWidth;
    const style = window.getComputedStyle(this.sliderList);
    this.gap = parseFloat(style.gap) || 0;

    const containerWidth = this.slider.offsetWidth;
    const totalContentWidth =
      (this.itemWidth + this.gap) * this.items.length - this.gap;

    if (totalContentWidth <= containerWidth + 5) {
      this.isActive = false;
      this.sliderList.style.transform = `translateX(0)`;
      this.sliderList.style.cursor = 'default';
      this.togglePaginationVisibility(false);
    } else {
      this.isActive = true;
      this.sliderList.style.cursor = 'grab';
      this.togglePaginationVisibility(true);

      const effectiveItemWidth = this.itemWidth || 1;
      const visibleItems = Math.floor(containerWidth / effectiveItemWidth);
      const effectiveVisible = visibleItems < 1 ? 1 : visibleItems;

      this.maxIndex = this.items.length - effectiveVisible;
      if (this.maxIndex < 0) this.maxIndex = 0;
    }

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  addEventListeners() {
    this.paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (!this.isActive) return;
        this.goToSlide(index);
      });
    });

    this.sliderList.addEventListener('touchstart', this.touchStart.bind(this), {
      passive: true,
    });
    this.sliderList.addEventListener('touchmove', this.boundTouchMove, {
      passive: false,
    });
    this.sliderList.addEventListener('touchend', this.boundTouchEnd);

    this.sliderList.addEventListener('mousedown', this.touchStart.bind(this));
    this.sliderList.addEventListener('mousemove', this.boundTouchMove);
    this.sliderList.addEventListener('mouseup', this.boundTouchEnd);
    this.sliderList.addEventListener('mouseleave', this.boundTouchEnd); // Использование boundTouchEnd

    this.sliderList.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
  }

  getPositionX(event) {
    return event.type.includes('mouse')
      ? event.pageX
      : event.touches[0].clientX;
  }

  touchStart(event) {
    if (!this.isActive) return;

    cancelAnimationFrame(this.animationID); 

    this.isDragging = true;
    this.startPos = this.getPositionX(event);
    this.currentPosition = this.startPos; 
    this.sliderList.style.cursor = 'grabbing';

    this.prevTranslate = -(this.currentIndex * (this.itemWidth + this.gap));

    this.animationID = requestAnimationFrame(this.boundAnimation);
  }

  touchMove(event) {
    if (!this.isDragging) return;

    if (event.cancelable && event.type.includes('touch')) {
      const currentX = this.getPositionX(event);
      const diffX = Math.abs(currentX - this.startPos);
      if (diffX > 10) event.preventDefault();
    }

    this.currentPosition = this.getPositionX(event);
  }

  touchEnd() {
    if (!this.isDragging) return; 

    this.isDragging = false;
    cancelAnimationFrame(this.animationID);
    this.sliderList.style.cursor = 'grab';

    const movedBy = this.currentPosition - this.startPos;
    const threshold = 70;

    if (movedBy < -threshold) {
      if (this.currentIndex < this.maxIndex) this.currentIndex += 1;
    } else if (movedBy > threshold) {
      if (this.currentIndex > 0) this.currentIndex -= 1;
    }

    this.goToSlide(this.currentIndex, true);
  }

  animation() {
    if (this.isDragging) {
      const diff = this.currentPosition - this.startPos;

      let translation = this.prevTranslate + diff;

      const minTranslate = -(this.maxIndex * (this.itemWidth + this.gap));
      if (translation > 0) {
        translation = translation / 3;
      } else if (translation < minTranslate) {
        translation = minTranslate + (translation - minTranslate) / 3;
      }

      this.sliderList.style.transform = `translateX(${translation}px)`;
      this.sliderList.style.transition = 'none';

      this.animationID = requestAnimationFrame(this.boundAnimation);
    }
  }

  goToSlide(index, animate = true) {
    if (index < 0) index = 0;
    if (index > this.maxIndex) index = this.maxIndex;

    this.currentIndex = index;

    const translateX = -(this.currentIndex * (this.itemWidth + this.gap));

    this.sliderList.style.transform = `translateX(${translateX}px)`;

    this.sliderList.style.transition = animate
      ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';

    this.updatePagination();
  }

  updatePagination() {
    this.paginationDots.forEach((dot, idx) => {
      dot.classList.remove('slider-pagination-list__item--active');
      if (idx === this.currentIndex) {
        dot.classList.add('slider-pagination-list__item--active');
      }
    });
  }

  togglePaginationVisibility(show) {
    const paginationContainer = this.slider.querySelector(
      '[data-pagination-container]'
    );
    if (paginationContainer) {
      paginationContainer.style.opacity = show ? '1' : '0';
      paginationContainer.style.pointerEvents = show ? 'all' : 'none';
    }
  }
}





(() => {
  const slider = document.querySelector(".slider");
  const track = slider.querySelector(".slider__track");
  const slides = slider.querySelectorAll(".slider__slide");
  const btnPrev = document.querySelector(".slider-btn--prev");
  const btnNext = document.querySelector(".slider-btn--next");

  if (!slider || !track || !slides.length) return;

  const GAP = 24;
  let index = 0;

  const getSlidesPerView = () => {
    if (window.innerWidth >= 1200) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const getSlideWidth = () =>
    slides[0].offsetWidth + GAP;

  const updateSlider = () => {
    const slideWidth = getSlideWidth();
    track.style.transform = `translateX(-${index * slideWidth}px)`;
    updateButtons();
  };

  const updateButtons = () => {
    const maxIndex = slides.length - getSlidesPerView();
    btnPrev.disabled = index === 0;
    btnNext.disabled = index >= maxIndex;
  };

  btnNext.addEventListener("click", () => {
    const maxIndex = slides.length - getSlidesPerView();
    if (index < maxIndex) {
      index++;
      updateSlider();
    }
  });

  btnPrev.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  window.addEventListener("resize", () => {
    const maxIndex = slides.length - getSlidesPerView();
    index = Math.min(index, maxIndex);
    updateSlider();
  });

  updateSlider();
})();




