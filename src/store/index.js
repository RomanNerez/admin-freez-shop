import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import lang from './lang'
import settings from './settings/settings'
import loading from './loading'
import confirmModel from './confirm-model'
import notification from './notification'
import store from './store/store'
import collections from './collections'
import pages from './pages'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    lang,
    settings,
    store,
    loading,
    confirmModel,
    notification,
    collections,
    pages,
  },
  state: () => ({
    drawer: null,
    title: '',
    selectCategories: null,
  }),
  getters: {
    getDrawer(state) {
      return state.drawer
    },
    getTitle(state) {
      return state.title
    },
    getSelectCategories(state) {
      return state.selectCategories
    },
  },
  mutations: {
    updateDrawer(state, payload) {
      state.drawer = payload
    },
    updateTitle(state, payload) {
      state.title = payload
    },
    updateSelectCategories(state, payload) {
      state.selectCategories = payload
    },
  },
})
