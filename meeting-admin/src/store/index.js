/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-21 16:46:38
 */
import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import userCertification from "./modules/userCertification";
import menuConfig from "./modules/menuConfig";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    userCertification,
    menuConfig,
  },
});
