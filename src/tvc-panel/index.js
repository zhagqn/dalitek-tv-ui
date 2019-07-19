import TvcPanel from "./src/main.vue";

TvcPanel.install = function(Vue) {
  Vue.component(TvcPanel.name, TvcPanel);
};

export default TvcPanel;
