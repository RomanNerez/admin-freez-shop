import { getLang } from '@/services/api-data'
import { LOADING_GET_LANG } from '@/constants/loadingIds'

export default {
  namespaced: true,
  state: () => ({
    langs: [],
    select: 1,
    selectLocal: process.env.VUE_APP_I18N_LOCALE || 'ru',
  }),
  getters: {
    getLangs(state) {
      return state.langs
    },
    getSelect(state) {
      return state.select
    },
    getSelectLocal(state) {
      return state.selectLocal
    },
  },
  mutations: {
    updateLang(state, payload) {
      state.langs = payload
    },
    updateSelectLocal(state, local) {
      state.selectLocal = local
    },
  },
  actions: {
    async getLang({ commit }) {
      commit('loading/addLoadingId', LOADING_GET_LANG, { root: true })
      const lang = await getLang()
      commit('loading/removeLoadingId', LOADING_GET_LANG, { root: true })
      if (!lang) return
      commit('updateLang', lang)
    },
  },
}
