(() => {

  const SHOW_TIME = 1400;     // мін. час показу loader (мс)
  const FINISH_TIME = 2300;  // час анімації виїзду яхти

  const loader = document.getElementById("loader");

  if (!loader) {
    console.warn("Loader not found");
    return;
  }

  const startFinish = () => {
    loader.classList.add("finish");

    setTimeout(() => {
      loader.classList.add("hide");
    }, FINISH_TIME);
  };

  // Основний запуск
  window.addEventListener("load", () => {
    setTimeout(startFinish, SHOW_TIME);
  });

  // ====== DEV METHODS ======
  // ⌨ ручне керування для тестів з консолі

  window.showLoader = () => {
    loader.classList.remove("finish", "hide");
  };

  window.hideLoader = () => {
    startFinish();
  };

})();
