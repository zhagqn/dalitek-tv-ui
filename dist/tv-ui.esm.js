/*!
 * tv-ui v0.2.1 
 * (c) 2019 zhagqn
 * Released under the MIT License.
 */
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var utils = {
  getClientRect: function getClientRect(el) {
    var rect = {
      x: el.offsetLeft,
      y: el.offsetTop
    };
    var parent = el.offsetParent;

    while (parent) {
      rect.x += parent.offsetLeft;
      rect.y += parent.offsetTop;
      parent = parent.offsetParent;
    }

    var parentElement = el.parentElement;

    while (parentElement) {
      rect.x -= parentElement.scrollLeft;
      rect.y -= parentElement.scrollTop;
      parentElement = parentElement.parentElement;
    }

    rect.width = el.offsetWidth;
    rect.height = el.offsetHeight;
    return rect;
  },
  preload: function preload(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.src = url;

      img.onload = function () {
        resolve();
      };

      img.onerror = function () {
        resolve();
      };
    });
  },
  sleep: function sleep(d) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, d);
    });
  },
  nextTick: function nextTick(_this) {
    return new Promise(function (resolve) {
      _this.$nextTick(function () {
        resolve();
      });
    });
  }
};

var script = {
  name: "TvcPanel",
  props: {
    focus: {
      default: false
    },
    value: {
      default: 0,
      type: Number
    }
  },
  data: function data() {
    return {
      children: [],
      focusIndex: -1,
      focusChild: null
    };
  },
  mounted: function mounted() {
    this.findChildren();
  },
  methods: {
    onKey: function onKey(key) {
      var _this = this;

      if (this.focus) {
        if (["left", "right", "up", "down"].includes(key)) {
          var item = this.directKey(key);

          if (item.closestChild) {
            this.focusChild = item.closestChild;
            this.focusIndex = item.index;
            this.scrollIntoView(this.focusChild.$el);
            this.$emit("focus", this.focusIndex);
            this.$emit("input", this.focusIndex);
          } else {
            this.$nextTick(function () {
              _this.$emit("blur", key);
            });
          }
        }
      }
    },
    clearFocus: function clearFocus() {
      this.focusIndex = -1, this.focusChild = null;
    },
    findChildren: function findChildren() {
      var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.value;
      var children = [];

      function getChildren(parent) {
        var c = [];

        if (parent.$children.length > 0) {
          parent.$children.forEach(function (child) {
            if (child.$options.name === "TvcCell") {
              c.push(child);
            } else {
              c.push(getChildren(child));
            }
          });
        }

        return c;
      }

      children.push.apply(children, _toConsumableArray(getChildren(this)));
      this.children = children;

      if (this.children.length > i) {
        this.focusChild = this.children[i];
        this.focusIndex = i;
        this.$emit("focus", this.focusIndex);
        this.$emit("input", this.focusIndex);
      } else if (this.children.length > 0) {
        i = 0;
        this.focusChild = this.children[i];
        this.focusIndex = i;
        this.$emit("focus", this.focusIndex);
        this.$emit("input", this.focusIndex);
      }
    },
    directKey: function directKey(direct) {
      var that = this;
      var children = that.children,
          focusChild = that.focusChild;
      var index = -1;
      var closestChild = null;
      var minDis = 0;
      children.forEach(function (child, i) {
        if (child._uid === focusChild._uid) return; // 不是当前 focus 的 child, 获取其与 focusChild 的 x y 距离

        var childRect = utils.getClientRect(child.$el);
        var focusRect = utils.getClientRect(focusChild.$el);
        var disX = childRect.x - focusRect.x;
        var disY = childRect.y - focusRect.y;
        var dis = Math.sqrt(disX * disX + disY * disY);

        if (!minDis || dis < minDis) {
          if (direct == "left" && disX < 0 || // 靠左
          direct == "right" && disX > 0 || // 靠右
          direct == "up" && disY < 0 || // 靠上
          direct == "down" && disY > 0 // 靠下
          ) {
              minDis = dis;
              closestChild = child;
              index = i;
            }
        }
      });
      return {
        closestChild: closestChild,
        index: index
      };
    },
    // 滚动到视图中
    scrollIntoView: function scrollIntoView(child) {
      var scroll = {
        x: 0,
        y: 0
      };
      var childRect = utils.getClientRect(child);
      var parentRect = utils.getClientRect(this.$refs.wrapper);

      if (childRect.x + childRect.width > parentRect.x + parentRect.width) {
        scroll.x = childRect.x + childRect.width - (parentRect.x + parentRect.width);
      }

      if (childRect.y + childRect.height > parentRect.y + parentRect.height) {
        scroll.y = childRect.y + childRect.height - (parentRect.y + parentRect.height);
      }

      if (childRect.x < parentRect.x) {
        scroll.x = childRect.x - parentRect.x;
      }

      if (childRect.y < parentRect.y) {
        scroll.y = childRect.y - parentRect.y;
      }

      var step = {
        x: scroll.x / 10,
        y: scroll.y / 10
      };
      var that = this;

      function move() {
        var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          x: 0,
          y: 0
        };

        if (Math.abs(d.x) <= Math.abs(scroll.x) && Math.abs(d.y) <= Math.abs(scroll.y)) {
          requestAnimationFrame(function () {
            if (!that.$refs.wrapper) return;
            that.$refs.wrapper.scrollLeft += step.x;
            that.$refs.wrapper.scrollTop += step.y;
            d.x += step.x;
            d.y += step.y;
            requestAnimationFrame(function () {
              if (!that.$refs.wrapper) return;
              that.$refs.wrapper.scrollLeft += step.x;
              that.$refs.wrapper.scrollTop += step.y;
              d.x += step.x;
              d.y += step.y;
              move(d);
            });
          });
        }
      }

      move(); // this.$refs.wrapper.scrollLeft += scroll.x;
      // this.$refs.wrapper.scrollTop += scroll.y;
    }
  },
  watch: {
    value: function value(nv) {
      this.findChildren(nv);
    },
    focus: function focus(nv) {
      if (nv) {
        this.findChildren();
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"wrapper",staticClass:"__tvc-panel",class:_vm.focus ? 'focus':''},[_vm._t("default")],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var TvcPanel = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

TvcPanel.install = function (Vue) {
  Vue.component(TvcPanel.name, TvcPanel);
};

//
//
//
//
//
var script$1 = {
  name: "TvcCell",
  computed: {
    focus: function focus() {
      var parentFocusChild = this.$parent.focusChild;
      return parentFocusChild == this;
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"__tvc-cell",class:_vm.focus ? 'focus': ''},[_vm._t("default")],2)};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var TvcCell = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

TvcCell.install = function (Vue) {
  Vue.component(TvcCell.name, TvcCell);
};

function TvcHandler (Vue) {
  var root = null;

  var keyHandler = function keyHandler(key) {
    // 找到符合条件的组件后触发按键事件
    var emitKeyEvent = function emitKeyEvent(child) {
      if (child.hasOwnProperty("_inactive") && child._inactive) return;

      if (child.$children) {
        // 触发组件的自组件按键事件
        child.$children.forEach(function (child) {
          emitKeyEvent(child);
        });
      }

      if (child.onKey) child.onKey(key);
    };

    emitKeyEvent(root);
  };

  var keyUpHandler = function keyUpHandler(e) {
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

  var keyDownHandler = function keyDownHandler(e) {
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
    mounted: function mounted() {
      if (this.$parent || root) return;
      root = this.$root;
      document.onkeyup = keyUpHandler;
      document.onkeydown = keyDownHandler;
    }
  });
}

var components = [TvcPanel, TvcCell];
var handlers = [TvcHandler];

var install = function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  components.map(function (component) {
    Vue.component(component.name, component);
  });
  handlers.map(function (handler) {
    Vue.use(handler);
  });
  Vue.prototype.$utils = utils;
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

var index = {
  install: install,
  TvcPanel: TvcPanel,
  TvcCell: TvcCell
};

export default index;
