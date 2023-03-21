/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-18 15:40:45
 * @LastEditTime: 2023-03-21 16:46:30
 */
const userCertification = {
  state: {
    state2: 0,
  },
  mutations: {
    SET_STATE: (state, state2) => {
      state.state2 = state2;
    },
  },
  actions: {},
  getters: {
    state2: (state) => state.state2,
  },
};

export default userCertification;
