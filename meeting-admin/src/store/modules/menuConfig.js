/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-19 10:00:28
 * @LastEditTime: 2023-03-21 16:24:40
 */
const menuConfig = {
  state: {
    collapse: true,
  },
  mutations: {
    SET_COLLAPSE: (state) => {
      state.collapse = !state.collapse;
      // console.log(state.collapse);
    },
  },
  actions: {},
  getters: {
    get_collapse: (state) => state.collapse,
  },
};

export default menuConfig;
