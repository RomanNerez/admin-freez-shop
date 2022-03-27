import {
  getCategories,
  copyCategory,
  deleteCategory,
  createCategory,
  editCategory,
} from '@/services/api-data'

import {
  LOADING_COPY_STORE_CATEGORY,
  LOADING_DELETE_STORE_CATEGORY,
} from '@/constants/loadingIds'

export default {
  namespaced: true,
  state: () => ({
    categories: [],
    editCategory: null,
    formDialog: false,
  }),
  getters: {
    getCategories(state) {
      return state.categories
    },
    getEditCategory(state) {
      return state.editCategory
    },
    getFormDialog(state) {
      return state.formDialog
    },
  },
  mutations: {
    updateCategories(state, payload) {
      state.categories = payload
    },
    updateEditCategory(state, payload) {
      state.editCategory = payload
    },
    updateFormDialog(state, payload) {
      state.formDialog = payload
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
      commit('loading/addLoadingId', LOADING_COPY_STORE_CATEGORY, {
        root: true,
      })

      commit(
        'notification/updateOptions',
        {
          show: true,
          color: 'blue darken-1',
          text: 'Копирование категории...',
          timeout: -1,
          btn: {
            loading: true,
          },
        },
        { root: true }
      )

      const category = await copyCategory(payload)

      commit('loading/removeLoadingId', LOADING_COPY_STORE_CATEGORY, {
        root: true,
      })

      commit(
        'notification/updateOptions',
        {
          show: true,
          text: 'Категория успешно скопирована',
          timeout: 5000,
        },
        { root: true }
      )

      commit('addCategory', category)
      commit('updateEditCategory', null)
    },

    async deleteCategory({ commit }, payload) {
      commit('loading/addLoadingId', LOADING_DELETE_STORE_CATEGORY, {
        root: true,
      })
      commit(
        'notification/updateOptions',
        {
          show: true,
          color: 'blue darken-1',
          text: 'Удаление категории...',
          timeout: -1,
          btn: {
            loading: true,
          },
        },
        { root: true }
      )
      await deleteCategory(payload)

      commit('loading/removeLoadingId', LOADING_COPY_STORE_CATEGORY, {
        root: true,
      })

      commit(
        'notification/updateOptions',
        {
          show: true,
          text: 'Категория успешно удалена',
          timeout: 5000,
        },
        { root: true }
      )
    },

    async createCategory(c, payload) {
      const category = await createCategory(payload)
      console.log(category)
    },
    async editCategory(c, payload) {
      const category = await editCategory(payload)
      console.log(category)
    },
  },
}
