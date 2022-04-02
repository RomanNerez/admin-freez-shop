import { getCollections } from '@/services/api-data'

export default {
  namespaced: true,
  state: () => ({
    collections: [],
  }),
  getters: {
    getCollections(state) {
      return state.collections
    },
  },
  mutations: {
    updateCollections(state, payload) {
      state.collections = payload
    },
  },
  actions: {
    async getCollections({ commit }) {
      const collections = await getCollections()
      commit('updateCollections', collections)
    },
  },
}
