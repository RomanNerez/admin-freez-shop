import {
  getCurrency,
  createCurrency,
  deleteCurrency,
  editCurrency,
  updateCurrency,
} from '@/services/api-data'
import {
  LOADING_GET_CURRENCY,
  LOADING_CREATE_CURRENCY,
  LOADING_EDIT_CURRENCY,
  LOADING_DELETE_CURRENCY,
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
    updateEditCurrency(state, payload) {
      state.editCurrency = payload
    },
    updateFormDialog(state, payload) {
      state.formDialog = payload
    },
    updateValues(state, payload) {
      state.values = payload
    },
    addList(state, payload) {
      state.list = [...state.list, payload]
    },
    addValues(state, payload) {
      state.values = [...state.values, ...payload]
    },
    deleteList(state, id) {
      state.list = state.list.filter((item) => item.id !== id)
    },
    deleteValues(state, id) {
      state.values = state.values.filter((item) => item.first !== id)
    },
    editList(state, payload) {
      state.list = [
        ...state.list.filter((item) => item.id !== payload.id),
        payload,
      ]
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
      const currency = await createCurrency(payload)
      commit('loading/removeLoadingId', LOADING_CREATE_CURRENCY, { root: true })
      if (!currency) return

      commit('addList', currency.list)
      commit('addValues', currency.values)
      commit('updateFormDialog', false)
    },

    async editCurrency({ commit }, payload) {
      commit('loading/addLoadingId', LOADING_EDIT_CURRENCY, { root: true })
      const currency = await editCurrency(payload)
      commit('loading/removeLoadingId', LOADING_EDIT_CURRENCY, { root: true })
      if (!currency) return
      commit('editList', currency.output)
      commit('updateEditCurrency', null)
      commit('updateFormDialog', false)
    },

    async updateCurrency(commit, payload) {
      payload.pending = true
      const currency = await updateCurrency(payload)
      payload.pending = false
      if (!currency) return
    },

    async deleteCurrency({ commit }, id) {
      commit('loading/addLoadingId', LOADING_DELETE_CURRENCY, { root: true })

      commit(
        'notification/updateOptions',
        {
          show: true,
          color: 'blue darken-1',
          text: 'Удаление валюты и связанных пар...',
          timeout: -1,
          btn: {
            loading: true,
          },
        },
        { root: true }
      )

      await deleteCurrency(id)
      commit('loading/removeLoadingId', LOADING_DELETE_CURRENCY, { root: true })

      commit('updateEditCurrency', null)
      commit(
        'notification/updateOptions',
        {
          show: true,
          text: 'Валюта и связанные пары успешно удалены',
          timeout: 5000,
        },
        { root: true }
      )

      commit('deleteList', id)
      commit('deleteValues', id)
    },
  },
}
