import TvcCell from "./src/main.vue";

TvcCell.install = function(Vue) {
  Vue.component(TvcCell.name, TvcCell);
};

export default TvcCell;
