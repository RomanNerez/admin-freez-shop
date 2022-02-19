import { getOptions } from '@/services/api-data'
import { LOADING_GET_OPTIONS } from '@/constants/loadingIds'

export default {
  namespaced: true,
  state: () => ({
    options: {},
  }),
  getters: {
    getOptions(state) {
      return state.options
    },
  },
  mutations: {
    updateOptions(state, payload) {
      state.options = payload
    },
  },
  actions: {
    async findOptions({ commit }) {
      commit('loading/addLoadingId', LOADING_GET_OPTIONS, { root: true })
      const data = await getOptions()
      commit('loading/removeLoadingId', LOADING_GET_OPTIONS, { root: true })
      if (!data) return
      commit('updateOptions', data)
    },
  },
}
