// 引入相关模块
import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用路由
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: '登录',
    component: () => import('@/views/Login'),
    meta: {
      title: '登录',
      index: 1
    }
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/handleAppointments',
    component: () => import('@/views/Home'),
    meta: {
      title: '首页',
      index: 2
    },
    children: [
      {
        path: '/home/handleAppointments',
        name: '处理预约',
        iconClass: 'el-icon-time',
        component: () => import('@/views/Home/handleAppointments'),
        meta: {
          title: '处理预约',
        }
      },
      {
        path: '/home/UserManagement',
        name: '用户认证审核与管理',
        iconClass: 'el-icon-s-check',
        component: () => import('@/views/Home/UserManagement'),
        meta: {
          title: '用户认证审核与管理',
        }
      },
      {
        path: '/home/roomManagement',
        name: '会议室管理',
        iconClass: 'el-icon-menu',
        component: () => import('@/views/Home/roomManagement'),
        meta: {
          title: '会议室管理',
        }
      }
    ],
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: {
      title: 'Page not found',
    },
    component: () => import('@/views/NotFound')
  },
  // 所有未定义的路由跳转到 404
  {
    path: '*',
    redirect: '/404'
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// 全局前置守卫

// 全局后置守卫：初始化时执行、每次路由切换后执行

export default router;