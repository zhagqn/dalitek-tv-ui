import TvcPanel from "./tvc-panel";
import TvcCell from "./tvc-cell";
import TvcHandler from "./tvc-handler";
import utils from "./utils";

const components = [TvcPanel, TvcCell];
const handlers = [TvcHandler];

const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;
  components.map(component => {
    Vue.component(component.name, component);
  });
  handlers.map(handler => {
    Vue.use(handler);
  });
  Vue.prototype.$utils = utils;
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  TvcPanel,
  TvcCell
};
