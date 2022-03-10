import { getCurrency, createCurrency } from '@/services/api-data'
import {
  LOADING_GET_CURRENCY,
  LOADING_CREATE_CURRENCY,
} from '@/constants/loadingIds'

export default {
  namespaced: true,
  state: () => ({
    list: [],
    values: [],
    formDialog: false,
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
    getFormDialog(state) {
      return state.formDialog
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
    updateFormDialog(state, payload) {
      state.formDialog = payload
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
    async createCurrency({ commit }, payload) {
      commit('loading/addLoadingId', LOADING_CREATE_CURRENCY, { root: true })
      const { currency } = await createCurrency(payload)
      commit('loading/removeLoadingId', LOADING_CREATE_CURRENCY, { root: true })
      if (!currency) return
    },
  },
}
