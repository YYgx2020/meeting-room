// 引入相关模块
import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用路由
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录',
      index: 1
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// 全局前置守卫

// 全局后置守卫：初始化时执行、每次路由切换后执行

export default router;