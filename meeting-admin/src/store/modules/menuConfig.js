
const menuConfig = {

  state: {
    collapse: true,
  },
  mutations: {
    SET_COLLAPSE: (state) => {

      state.collapse = !state.collapse;
      console.log(state.collapse);

  },
  },
  actions: {

  },
  getters : {
    get_collapse: (state) => state.collapse,
  }
  
  
}


export default menuConfig