export default {
  getClientRect(el) {
    let rect = { x: el.offsetLeft, y: el.offsetTop };
    let parent = el.offsetParent;
    while (parent) {
      rect.x += parent.offsetLeft;
      rect.y += parent.offsetTop;
      parent = parent.offsetParent;
    }
    let parentElement = el.parentElement;
    while (parentElement) {
      rect.x -= parentElement.scrollLeft;
      rect.y -= parentElement.scrollTop;
      parentElement = parentElement.parentElement;
    }
    rect.width = el.offsetWidth;
    rect.height = el.offsetHeight;
    return rect;
  },
  preload(url) {
    return new Promise(resolve => {
      let img = new Image();
      img.src = url;
      img.onload = () => {
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
    });
  },
  sleep(d) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, d);
    });
  },
  nextTick(_this) {
    return new Promise(resolve => {
      _this.$nextTick(() => {
        resolve();
      });
    });
  }
};
