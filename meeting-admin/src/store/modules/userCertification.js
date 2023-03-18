



const userCertification = {

  state: {
   state2:0
  },
  mutations: {
    SET_STATE: (state, state2) => {
      state.state2 = state2
  },
  },
  actions: {

  },
  getters : {
    state2: state => state.state2,
  }
  
  
}


export default userCertification