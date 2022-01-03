import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import lang from './lang'
import settings from './settings'
import loading from './loading'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { auth, lang, settings, loading },
})
