import {
  getCategories,
  copyCategory,
  deleteCategory,
} from '@/services/api-data'

export default {
  namespaced: true,
  state: () => ({
    categories: [],
    editCategory: null,
  }),
  getters: {
    getCategories(state) {
      return state.categories
    },
    getEditCategory(state) {
      return state.editCategory
    },
  },
  mutations: {
    updateCategories(state, payload) {
      state.categories = payload
    },
    updateEditCategory(state, payload) {
      state.editCategory = payload
    },
    addCategory(state, payload) {
      state.categories.unshift(payload)
    },
  },
  actions: {
    async getCategories({ commit }) {
      const categories = await getCategories()
      commit('updateCategories', categories)
    },
    async copyCategory({ commit }, payload) {
      const category = await copyCategory(payload)
      commit('addCategory', category)
      commit('updateEditCategory', null)
    },
    async deleteCategory(c, payload) {
      const category = await deleteCategory(payload)
      console.log(category)
    },
  },
}
