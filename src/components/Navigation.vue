<template>
  <v-navigation-drawer
    app
    :value="getDrawer"
    :dark="true"
    class="background-sidebar"
  >
    <v-divider
      style="width: calc(100% - 32px) !important"
      class="ml-4"
    ></v-divider>

    <v-list-item class="px-3 py-3">
      <v-list-item-avatar class="mr-3 ml-2">
        <span>{{ getUser.fullname | firstLetter }}</span>
      </v-list-item-avatar>
      <v-list-item-title class="mr-2">{{ getUser.fullname }}</v-list-item-title>
    </v-list-item>

    <v-divider
      style="width: calc(100% - 32px) !important"
      class="ml-4"
    ></v-divider>
    <v-list class="pa-4">
      <v-list-group
        v-for="(menu, index) in menus"
        :value="index === selecteditem"
        :key="index"
        dense
        class="py-1"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              v-text="menu.title"
              class="white--text"
            ></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(child, index) in menu.child"
          :key="index"
          class="px-3 my-2"
          :class="{ 'is-active': $route.name === child.to.name }"
          v-on:click="push(child)"
        >
          <v-list-item-icon class="my-3 mr-4 ml-1">
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="font-weight-regular text-body-2">{{
              child.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { createNamespacedHelpers, mapGetters, mapMutations } from 'vuex'

const { mapGetters: mapGettersAuth } = createNamespacedHelpers('auth')

export default {
  name: 'Navigation',
  data() {
    return {
      selectItem: this.$store?.state?.data?.divide || 'settings-base',
      selected: {
        categories: null,
      },
      menus: [
        {
          title: 'Настройки',
          icon: 'mdi-format-list-bulleted',
          child: [
            {
              title: 'Основное',
              icon: 'mdi-cube-outline',
              to: { name: 'Base' },
            },
            {
              title: 'Валюты',
              icon: 'mdi-currency-usd',
              to: { name: 'Currency' },
            },
            {
              title: 'Меню',
              icon: 'mdi-menu-open',
              to: { name: 'Menu' },
            },
          ],
        },
        {
          title: 'Магазин',
          icon: 'mdi-format-list-bulleted',
          child: [
            {
              title: 'Категории',
              icon: 'mdi-layers-triple',
              to: { name: 'StoreCategories' },
            },
            {
              title: 'Группы',
              icon: 'mdi-animation',
              to: { name: 'StoreGroups' },
            },
            {
              title: 'Коллекции',
              icon: 'mdi-rhombus-split',
              to: { name: 'StoreCollections' },
            },
            {
              title: 'Атрибуты',
              icon: 'mdi-tag-multiple-outline',
              to: { name: 'StoreAttributes' },
            },
            {
              title: 'Товары',
              icon: 'mdi-unity',
              to: { name: 'StoreProducts' },
            },
          ],
        },
        // {
        //   title: 'Услуги',
        //   icon: 'mdi-format-list-bulleted',
        //   child: [
        //     {
        //       title: 'Категории',
        //       icon: 'mdi-buffer',
        //       component: 'services-categories',
        //     },
        //     {
        //       title: 'Группы',
        //       icon: 'mdi-animation',
        //     },
        //     {
        //       title: 'Атрибуты',
        //       icon: 'mdi-tag-multiple-outline',
        //       component: 'services-attributes',
        //     },
        //     {
        //       title: 'Товары',
        //       icon: 'mdi-unity',
        //     },
        //   ],
        // },
        // {
        //   title: 'Контент',
        //   icon: 'mdi-format-list-bulleted',
        //   child: [
        //     {
        //       title: 'Категории',
        //       icon: 'mdi-buffer',
        //       component: 'content-categories',
        //     },
        //     {
        //       title: 'Рубрики',
        //       icon: 'mdi-animation',
        //     },
        //     {
        //       title: 'Записи',
        //       icon: 'mdi-content-paste',
        //     },
        //     {
        //       title: 'Страницы',
        //       icon: 'mdi-format-page-break',
        //     },
        //   ],
        // },
        {
          title: 'CRM',
          icon: 'mdi-cart-outline',
          child: [
            {
              title: 'Заказы',
              icon: 'mdi-cart-outline',
              to: { name: 'CRMOrders' },
            },
            {
              title: 'Услуги',
              icon: 'mdi-unity',
              to: { name: 'CRMService' },
            },
            {
              title: 'Пользователи',
              icon: 'mdi-account-edit-outline',
              to: { name: 'CRMUsers' },
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.menus.forEach((menu) => {
      let child = menu.child.find((child) => child.to.name === this.$route.name)
      if (child) {
        this.updateTitle(child.title)
      }
    })
  },
  computed: {
    ...mapGetters(['getDrawer']),
    ...mapGettersAuth(['getUser']),
    selecteditem() {
      let index = null

      this.menus.forEach((menu, i) => {
        if (menu.child.find((child) => child.to.name === this.$route.name))
          index = i
      })

      return index
    },
  },
  filters: {
    firstLetter(value) {
      return value ? value[0] : ''
    },
  },
  methods: {
    ...mapMutations(['updateTitle']),
    push(child) {
      if (this.$route.name === child.to.name) return
      this.$router.push(child.to)
      this.updateTitle(child.title)
    },
  },
}
</script>

<style scoped>
.background-sidebar {
  background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url('../assets/sidebar-1.jpg');
  background-position: center;
  background-size: cover;
}
</style>
