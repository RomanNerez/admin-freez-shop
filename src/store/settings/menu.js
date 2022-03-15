import Vue from 'vue'
import axios from 'axios'
import { getMenuData } from '@/services/api-data'
import { DATA } from '@/router/paths-api'

export default {
  namespaced: true,
  state: () => ({
    items: [],
    menuList: [],
    arbitrary_links: [],
    area_visibilities: [],
    selectedAreaVisibility: null,
    changes: false,
  }),
  getters: {
    // getMenuList(state) {
    //   return state.items
    // },
    getSelectedAreaVisibility(state) {
      return state.selectedAreaVisibility
    },
    getMenuList(state) {
      return state.menuList
    },
    getChanges(state) {
      return state.changes
    },
    arbitraryLinks(state) {
      return state.arbitrary_links
    },
    areaVisibilities(state) {
      return state.area_visibilities
    },
  },
  mutations: {
    updateMenus(state, payload) {
      state.menuList = payload
    },
    updatedMenu(state, payload) {
      state.menuList[payload.selectedAreaVisibility] = payload.value
    },
    addMenu(state, payload) {
      if (!state.menuList[payload.selectedAreaVisibility]) {
        if (Array.isArray(state.menuList)) {
          Vue.set(state, 'menuList', {})
        }
        Vue.set(state.menuList, payload.selectedAreaVisibility, [])
        if (payload.items.length) {
          state.menuList[payload.selectedAreaVisibility] = [
            ...state.menuList[payload.selectedAreaVisibility],
            ...payload.items,
          ]
        }
      } else {
        state.menuList[payload.selectedAreaVisibility] = [
          ...state.menuList[payload.selectedAreaVisibility],
          ...payload.items,
        ]
      }
    },
    deleteMenuByAreaVisibility(state, payload) {
      state.menuList = state.menuList.filter((item) => {
        return item.area_visibility_id != payload
      })
    },
    updateParentId(state, payload) {
      state.menuList.forEach((item) => {
        if (item.id === payload.id) {
          item.parent_id = payload.parent_id
        }
      })
    },
    updateArbitraryMenu(state, payload) {
      state.menuList.forEach((item) => {
        if (item.instance_id === payload.id) {
          item.instance.content = payload.content
          item.instance.link = payload.link
        }
      })
    },
    deleteMenu(state, payload) {
      state.menuList.forEach((item, i) => {
        if (item.id === payload.id) {
          state.menuList.splice(i, 1, payload)
        }
        if (item.parent_id === payload.id) {
          item.parent_id = payload.parent_id
        }
      })
    },
    setOrder(state, payload) {
      state.menuList.forEach((item) => {
        item.order = payload[item.id] || 1
      })
    },
    updateChanges(state, payload) {
      state.changes = payload
    },
    updatedSelectedAreaVisibility(state, payload) {
      state.selectedAreaVisibility = payload
    },
    addAreaVisibility(state, payload) {
      state.area_visibilities.unshift(payload)
      if (!state.selectedAreaVisibility) {
        state.selectedAreaVisibility = payload.id
      }
    },
    deleteAreaVisibility(state, payload) {
      state.area_visibilities.forEach((item, index) => {
        if (item.id == payload) {
          state.area_visibilities.splice(index, 1)
        }
      })
      if (
        state.selectedAreaVisibility == payload &&
        state.area_visibilities.length
      ) {
        state.selectedAreaVisibility = state.area_visibilities[0].id
      }
      if (!state.area_visibilities.length) {
        state.selectedAreaVisibility = null
      }
    },
    editAreaVisibility(state, payload) {
      state.area_visibilities.forEach((item, index) => {
        if (item.id == payload.id) {
          state.area_visibilities.splice(index, 1, payload)
        }
      })
    },
    updateAreaVisibility(state, payload) {
      state.area_visibilities = payload
      state.selectedAreaVisibility = payload[0].id
    },
    updateMenuList(state, payload) {
      state.menuList = payload
    },
  },
  actions: {
    async getMenuData({ commit }) {
      const menuData = await getMenuData()
      commit('updateAreaVisibility', menuData.area_visibilities)
      commit('updateMenuList', menuData.items)
    },
    async createMenu(commit, payload) {
      return await axios.post(DATA.SETTINGS.MENU.CREATE, payload)
    },
    async deleteMenu(commit, payload) {
      return await axios.post(DATA.SETTINGS.MENU.DELETE, payload)
    },
    async updateMenu(commit, payload) {
      return await axios.post(DATA.SETTINGS.MENU.UPDATE, payload)
    },
    async addArbitraryLink(commit, payload) {
      return await axios.post(DATA.SETTINGS.ARBITRARY_LINKS.CREATE, payload)
    },
    async editArbitraryLink(commit, payload) {
      return await axios.post(DATA.SETTINGS.ARBITRARY_LINKS.DELETE, payload)
    },
    async addAreaVisibility(commit, payload) {
      return await axios.post(DATA.SETTINGS.AREA_VISIBILITY.ADD, payload)
    },
    async deleteAreaVisibility(commit, payload) {
      return await axios.post(DATA.SETTINGS.AREA_VISIBILITY.DELETE, payload)
    },
    async editAreaVisibility(commit, payload) {
      return await axios.post(DATA.SETTINGS.AREA_VISIBILITY.EDIT, payload)
    },
  },
}
