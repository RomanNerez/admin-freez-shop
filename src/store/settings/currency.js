import { getCurrency } from '@/services/api-data'
import { LOADING_GET_CURRENCY } from '@/constants/loadingIds'

export default {
  namespaced: true,
  state: () => ({
    list: [],
    values: [],
    editCurrency: null,
  }),
  getters: {
    getList(state) {
      return state.list
    },
    getValues(state) {
      return state.values
    },
    getEditCurrency(state) {
      return state.editCurrency
    },
  },
  mutations: {
    updateList(state, payload) {
      state.list = payload
    },
    updateValues(state, payload) {
      state.values = payload
    },
    updateEditCurrency(state, payload) {
      state.editCurrency = payload
    },
  },
  actions: {
    async getCurrency({ commit }) {
      commit('loading/addLoadingId', LOADING_GET_CURRENCY, { root: true })
      const { currency } = await getCurrency()
      commit('loading/removeLoadingId', LOADING_GET_CURRENCY, { root: true })
      if (!currency) return

      commit('updateList', currency.list)
      commit('updateValues', currency.values)
    },
  },
}
