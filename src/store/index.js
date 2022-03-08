import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, currentUser) {
      state.user = currentUser;
    }
  },
  actions: {
  },
  modules: {
  }
})
