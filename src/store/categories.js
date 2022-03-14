import { getCategories } from '@/services/api-data'

export default {
  namespaced: true,
  state: () => ({
    categories: [],
  }),
  getters: {
    getCategories(state) {
      return state.categories
    },
  },
  mutations: {
    updateCategories(state, payload) {
      state.categories = payload
    },
  },
  actions: {
    async getCategories({ commit }) {
      const categories = await getCategories()
      commit('updateCategories', categories)
    },
  },
}
