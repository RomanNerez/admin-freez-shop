export default {
  namespaced: true,
  state: () => ({
    loadingIds: [],
  }),
  getters: {
    getLoadingIds(state) {
      return state.loadingIds
    },
  },
  mutations: {
    addLoadingId(state, id) {
      state.loadingIds.push(id)
    },
    removeLoadingId(state, id) {
      state.loadingIds.splice(state.loadingIds.indexOf(id), 1)
    },
  },
}
