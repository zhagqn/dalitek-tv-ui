import Vue from "vue";
import App from "./App.vue";
import tvUI from "../index";
import router from "./router";

Vue.use(tvUI);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
