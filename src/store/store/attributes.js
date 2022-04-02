import { getAttributes } from '@/services/api-data'

export default {
  namespaced: true,
  state: () => ({
    attributes: [],
  }),
  getters: {
    getAttributes(state) {
      return state.attributes
    },
  },
  mutations: {
    updateAttributes(state, payload) {
      state.attributes = payload
    },
  },
  actions: {
    async findAttributes({ commit }) {
      const attributes = await getAttributes()
      commit('updateAttributes', attributes)
    },
  },
}
