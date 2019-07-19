<template>
  <div :class="focus ? 'focus':''" class="__tvc-panel" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import utils from "../../utils";
export default {
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
  data() {
    return {
      children: [],
      focusIndex: -1,
      focusChild: null
    };
  },
  mounted() {
    this.findChildren();
  },
  methods: {
    onKey(key) {
      if (this.focus) {
        if (["left", "right", "up", "down"].includes(key)) {
          let item = this.directKey(key);
          if (item.closestChild) {
            this.focusChild = item.closestChild;
            this.focusIndex = item.index;
            this.scrollIntoView(this.focusChild.$el);
            this.$emit("focus", this.focusIndex);
            this.$emit("input", this.focusIndex);
          } else {
            this.$nextTick(() => {
              this.$emit("blur", key);
            });
          }
        }
      }
    },
    clearFocus() {
      (this.focusIndex = -1), (this.focusChild = null);
    },
    findChildren(i = this.value) {
      let children = [];
      function getChildren(parent) {
        let c = [];
        if (parent.$children.length > 0) {
          parent.$children.forEach(child => {
            if (child.$options.name === "TvcCell") {
              c.push(child);
            } else {
              c.push(getChildren(child));
            }
          });
        }
        return c;
      }
      children.push(...getChildren(this));
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
    directKey(direct) {
      let that = this;
      let { children, focusChild } = that;
      let index = -1;
      let closestChild = null;
      let minDis = 0;
      children.forEach((child, i) => {
        if (child._uid === focusChild._uid) return;
        // 不是当前 focus 的 child, 获取其与 focusChild 的 x y 距离

        let childRect = utils.getClientRect(child.$el);
        let focusRect = utils.getClientRect(focusChild.$el);
        let disX = childRect.x - focusRect.x;
        let disY = childRect.y - focusRect.y;
        let dis = Math.sqrt(disX * disX + disY * disY);

        if (!minDis || dis < minDis) {
          if (
            (direct == "left" && disX < 0) || // 靠左
            (direct == "right" && disX > 0) || // 靠右
            (direct == "up" && disY < 0) || // 靠上
            (direct == "down" && disY > 0) // 靠下
          ) {
            minDis = dis;
            closestChild = child;
            index = i;
          }
        }
      });
      return { closestChild, index };
    },
    // 滚动到视图中
    scrollIntoView(child) {
      let scroll = { x: 0, y: 0 };
      let childRect = utils.getClientRect(child);
      let parentRect = utils.getClientRect(this.$refs.wrapper);
      if (childRect.x + childRect.width > parentRect.x + parentRect.width) {
        scroll.x =
          childRect.x + childRect.width - (parentRect.x + parentRect.width);
      }
      if (childRect.y + childRect.height > parentRect.y + parentRect.height) {
        scroll.y =
          childRect.y + childRect.height - (parentRect.y + parentRect.height);
      }

      if (childRect.x < parentRect.x) {
        scroll.x = childRect.x - parentRect.x;
      }
      if (childRect.y < parentRect.y) {
        scroll.y = childRect.y - parentRect.y;
      }
      let step = { x: scroll.x / 10, y: scroll.y / 10 };
      let that = this;
      function move(d = { x: 0, y: 0 }) {
        if (
          Math.abs(d.x) <= Math.abs(scroll.x) &&
          Math.abs(d.y) <= Math.abs(scroll.y)
        ) {
          requestAnimationFrame(() => {
            if (!that.$refs.wrapper) return;
            that.$refs.wrapper.scrollLeft += step.x;
            that.$refs.wrapper.scrollTop += step.y;
            d.x += step.x;
            d.y += step.y;
            requestAnimationFrame(() => {
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
      move();
      // this.$refs.wrapper.scrollLeft += scroll.x;
      // this.$refs.wrapper.scrollTop += scroll.y;
    }
  },
  watch: {
    value(nv) {
      this.findChildren(nv);
    },
    focus(nv) {
      if (nv) {
        this.findChildren();
      }
    }
  }
};
</script>
