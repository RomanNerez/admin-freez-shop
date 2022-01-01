import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    user: null,
  }),
  getters: {
    getUser(state) {
      return state.user
    },
  },
  mutations: {
    updateUser(state, user) {
      state.user = user
    },
  },
  actions: {
    async getUserData({ commit }) {
      const jwt = localStorage.getItem('Authorization')

      if (!jwt) return

      try {
        const { data } = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/auth/me`,
          {},
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
        commit('updateUser', data)
      } catch (e) {
        // console.log(e)
      }
    },
    async loginUser(state, credentials) {
      try {
        const { data } = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/auth/login`,
          credentials
        )
        localStorage.setItem('Authorization', `Bearer ${data.access_token}`)
      } catch (e) {
        // console.log(e)
      }
    },
    async logoutUser({ commit }) {
      const jwt = localStorage.getItem('Authorization')
      try {
        await axios.post(
          `${process.env.VUE_APP_API_URL}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
        localStorage.removeItem('Authorization')
        commit('updateUser', null)
      } catch (e) {
        // console.log(e)
      }
    },
  },
}
