import Vue from "./Vue";
import App from "./App.vue";
import router from "./router";

import "element-ui/lib/theme-chalk/index.css"; // 默认主题

import "./assets/css/icon.css";
import "./components/common/directives";
import "babel-polyfill";

Vue.config.productionTip = false;

// Vue.prototype.fetchData = axios.fetchData;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
