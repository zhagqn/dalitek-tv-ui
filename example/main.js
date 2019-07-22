import Vue from "vue";
import App from "./App.vue";
import tvUI from "../src/index";
import router from "./router";

Vue.use(tvUI);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
