import { getPages } from '@/services/api-data'

export default {
  namespaced: true,
  state: () => ({
    pages: [],
  }),
  getters: {
    getPages(state) {
      return state.pages
    },
  },
  mutations: {
    updatePages(state, payload) {
      state.pages = payload
    },
  },
  actions: {
    async getPages({ commit }) {
      const pages = await getPages()
      commit('updatePages', pages)
    },
  },
}
