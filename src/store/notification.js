const defaultState = {
  show: false,
  text: '',
  absolute: false,
  top: false,
  right: false,
  elevation: 0,
  color: 'success',
  timeout: 3000,
  btn: {
    loading: false,
    color: 'white',
  },
}

export default {
  namespaced: true,
  state: () => ({
    options: defaultState,
  }),
  getters: {
    getOptions(state) {
      return state.options
    },
  },
  mutations: {
    updateOptions(state, payload) {
      state.options = {
        ...defaultState,
        ...payload,
        btn: { ...defaultState.btn, ...(payload.btn ? payload.btn : {}) },
      }
    },
  },
}
