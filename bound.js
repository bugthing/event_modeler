export default class Bound {
  constructor(container) {
    this.container = container;
  }

  add(element) {
    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    let setTranslate = function (xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    };

    let dragStart = function (e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }
      currentX = initialX;
      currentY = initialY;

      if (e.target === element) {
        active = true;
      }
    };

    let dragEnd = function (e) {
      initialX = currentX;
      initialY = currentY;

      active = false;
    };

    let drag = function (e) {
      if (active) {
        e.preventDefault();

        if (element.dataset.mel_type === "Lane") {
          if (e.type === "touchmove") {
            //currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
          } else {
            //currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
          }
        } else {
          if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
          } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
          }
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, element);
      }
    };

    this.container.addEventListener("touchstart", dragStart, false);
    this.container.addEventListener("touchend", dragEnd, false);
    this.container.addEventListener("touchmove", drag, false);

    this.container.addEventListener("mousedown", dragStart, false);
    this.container.addEventListener("mouseup", dragEnd, false);
    this.container.addEventListener("mousemove", drag, false);
  }
}
