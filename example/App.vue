<template>
  <div id="app">
    <div>
      <tvc-bg-video :url="bgVideoUrl" :include="['about']" type="global"></tvc-bg-video>
      <div>{{message}}</div>
      <fieldset style="width: 800px; margin: 0 auto;">
        <legend>router</legend>
        <router-link to="/">index</router-link>
        <router-link to="/about">about</router-link>
      </fieldset>
    </div>
    <fieldset style="width: 1000px;margin:20px auto;">
      <legend>panel 0</legend>
      <tvc-panel @blur="blurPanel" :focus="focusPanel === 0" class="focus-panel">
        <tvc-cell v-for="i in 10" :key="i" class="focus-cell"></tvc-cell>
      </tvc-panel>
    </fieldset>
    <fieldset style="width: 1000px;margin:20px auto;">
      <legend>panel 1</legend>
      <tvc-panel @blur="blurPanel" :focus="focusPanel === 1" class="focus-panel">
        <tvc-cell v-for="i in 10" :key="i" class="focus-cell"></tvc-cell>
      </tvc-panel>
    </fieldset>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      message: "",
      focusPanel: 0,
      bgVideoUrl:
        process.env.NODE_ENV === "development"
          ? "media/bg.mp4"
          : "http://192.168.10.11:88/static/0086000028_ytgg/bg.mp4"
    };
  },
  methods: {
    blurPanel(key) {
      if (this.focusPanel === 0 && key === "down") {
        this.focusPanel = 1;
      }
      if (this.focusPanel === 1 && key === "up") {
        this.focusPanel = 0;
      }
    },
    onKey(key) {
      this.message = `emit key:${key} on App page`;
      console.log(this.message);
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 40px;
  a {
    margin: 0 10px;
  }
}

.focus-panel {
  display: flex;
  margin: 20px auto;
  width: 1000px;
  justify-content: center;
  flex-wrap: wrap;
}

.focus-cell {
  width: 150px;
  height: 50px;
  background: blue;
  margin: 10px;
  &.focus {
    background: red;
  }
}
</style>
