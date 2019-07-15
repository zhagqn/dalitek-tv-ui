<template>
  <fieldset style="width: 800px; margin: 0 auto;">
    <legend>about page</legend>
    <span>{{message}}</span>
  </fieldset>
</template>
<script>
export default {
  name: "about",
  data() {
    return {
      message: "try press key"
    };
  },
  methods: {
    onKey(key) {
      this.message = `emit key:${key} on about page`;
      console.log(this.message)
    }
  }
};
</script>
