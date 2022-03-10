export default {
  namespaced: true,
  state: () => ({
    open: false,
    dataConfirm: null,
  }),
  getters: {
    getOpen(state) {
      return state.open
    },
    getDataConfirm(state) {
      return state.dataConfirm
    },
  },
  mutations: {
    updateOpen(state, payload) {
      state.open = payload
    },
    updateDataConfirm(state, payload) {
      if (payload) state.open = true
      state.dataConfirm = payload
    },
  },
}
