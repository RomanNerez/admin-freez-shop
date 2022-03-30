import { getGroups } from '@/services/api-data'

export default {
  namespaced: true,
  state: () => ({
    groups: [],
  }),
  getters: {
    getGroups(state) {
      return state.groups
    },
  },
  mutations: {
    updateGroups(state, payload) {
      state.groups = payload
    },
  },
  actions: {
    async findGroups({ commit }) {
      const groups = await getGroups()
      commit('updateGroups', groups)
    },
  },
}
