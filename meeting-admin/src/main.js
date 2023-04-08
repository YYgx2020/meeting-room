import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui';
import axios from 'axios';
import store from './store';

import 'element-ui/lib/theme-chalk/index.css';
import Vab from './utils/vab';
//初始化微信云服务

import '@/cloud/cloud'
import '@/cloud/init_cloud'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios  // 将axios绑定到vue的原型上
Vue.prototype.$cloud=cloud

Vue.use(Vab)
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')
