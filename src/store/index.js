import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import lang from './lang'
import settings from './settings/settings'
import loading from './loading'
import confirmModel from './confirm-model'
import notification from './notification'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { auth, lang, settings, loading, confirmModel, notification },
})
