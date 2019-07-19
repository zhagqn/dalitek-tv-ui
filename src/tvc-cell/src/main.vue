<template>
  <div class="__tvc-cell" :class="focus ? 'focus': ''">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "TvcCell",
  computed: {
    focus() {
      let parentFocusChild = this.$parent.focusChild;
      return parentFocusChild == this;
    }
  }
};
</script>
