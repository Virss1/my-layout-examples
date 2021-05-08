'use strict';

window.addEventListener('DOMContentLoaded', function () {
  const previews = document.querySelectorAll('.example-card__preview');

  previews.forEach((preview) => {
    const forwardTransitionTime = preview.naturalHeight * 0.004;
    const backwardTransitionTime = preview.naturalHeight * 0.0005;
    preview.addEventListener('mouseenter', function () {
      this.style.cssText = `
        object-position: 0 100%;
        transition: object-position ${forwardTransitionTime}s 0.5s;`;
    });
    preview.addEventListener('mouseleave', function () {
      this.style.cssText = `transition: object-position ${backwardTransitionTime}s 0.5s;`;
    })
  });


});
