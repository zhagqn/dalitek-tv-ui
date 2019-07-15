<template>
  <fieldset style="width: 800px; margin: 0 auto;">
    <legend>index page</legend>
    <span>{{message}}</span>
  </fieldset>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
      message: "try press key"
    };
  },
  methods: {
    onKey(key) {
      this.message = `emit key:${key} on index page`;
      console.log(this.message);
    }
  }
};
</script>
