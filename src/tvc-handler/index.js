export default function(Vue) {
  let root = null;
  let keyHandler = key => {
    // 找到符合条件的组件后触发按键事件
    let emitKeyEvent = child => {
      if (child.hasOwnProperty("_inactive") && child._inactive) return;
      if (child.$children) {
        // 触发组件的自组件按键事件
        child.$children.forEach(child => {
          emitKeyEvent(child);
        });
      }
      if (child.onKey) child.onKey(key);
    };

    emitKeyEvent(root);
  };

  let keyUpHandler = e => {
    switch (e.keyCode) {
      case 8:
      case 10009:
        keyHandler("back");
        break;
      case 13:
        keyHandler("enter");
        break;
      default:
        break;
    }
  };

  let keyDownHandler = e => {
    switch (e.keyCode) {
      case 38:
        keyHandler("up");
        break;
      case 40:
        keyHandler("down");
        break;
      case 37:
        keyHandler("left");
        break;
      case 39:
        keyHandler("right");
        break;
      case 427:
        keyHandler("channeldown");
        break;
      case 428:
        keyHandler("channelup");
        break;
      default:
        break;
    }
  };
  Vue.mixin({
    mounted() {
      if (this.$parent || root) return;
      root = this.$root;
      document.onkeyup = keyUpHandler;
      document.onkeydown = keyDownHandler;
    }
  });
}
