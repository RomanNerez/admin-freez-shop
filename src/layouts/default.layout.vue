<template>
  <v-app id="inspire">
    <template v-if="!overlay">
      <v-navigation-drawer
        app
        v-model="drawer"
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
          <v-list-item-title class="mr-2">{{
            getUser.fullname
          }}</v-list-item-title>
        </v-list-item>

        <v-divider
          style="width: calc(100% - 32px) !important"
          class="ml-4"
        ></v-divider>
        <v-list class="pa-4">
          <v-list-group
            v-for="(menu, index) in menus"
            :value="index == selecteditem.menu"
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
              :class="{ 'is-active': selectItem === child.component }"
              v-on:click="
                child.to
                  ? $router.push(child.to)
                  : (selectItem = child.component)
              "
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

      <v-app-bar absolute app color="transparent" flat fixed height="90">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ selecteditem.data.title }}</v-toolbar-title>

        <template
          v-if="
            selecteditem.data.filter && selecteditem.data.filter.items.length
          "
        >
          <v-autocomplete
            label="Категория:"
            class="nav__filter"
            filled
            color="#4bb04f"
            v-model="selected.categories"
            :items="selecteditem.data.filter.items"
            item-text="content.ru.title"
            item-value="id"
            no-data-text="Нет совпадений..."
          ></v-autocomplete>
        </template>

        <template v-if="selecteditem.data.actions">
          <v-dialog v-if="selecteditem.data.actions.priceEdit" max-width="550">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                x-large
                dark
                class="ml-8"
              >
                <v-icon left> mdi-pencil </v-icon>
                Цены
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card class="dialog-wrap">
                <v-toolbar color="primary" dark>
                  Массовое редактирование стоимости товаров
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="4" align-self="center">
                      <span class="text-h6"><small>Направление</small></span>
                    </v-col>
                    <v-col cols="8" align-self="center">
                      <v-select
                        :items="[
                          {
                            val: -1,
                            name: 'Понижение',
                          },
                          {
                            val: 1,
                            name: 'Повышение',
                          },
                        ]"
                        item-value="val"
                        item-text="name"
                        color="green"
                        label="Направление"
                        solo
                        hide-details
                        v-model="actions.edit.price.direction"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" align-self="center">
                      <span class="text-h6"><small>Оператор</small></span>
                    </v-col>
                    <v-col cols="8" align-self="center">
                      <v-select
                        :items="[
                          {
                            val: 'percent',
                            name: 'Проценты',
                          },
                          {
                            val: 'int',
                            name: 'Число',
                          },
                        ]"
                        item-value="val"
                        item-text="name"
                        color="green"
                        label="Оператор"
                        solo
                        hide-details
                        v-model="actions.edit.price.operator"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" align-self="center">
                      <span class="text-h6"><small>Значение</small></span>
                    </v-col>
                    <v-col cols="8" align-self="center">
                      <v-text-field
                        type="number"
                        color="green"
                        label="Значение"
                        solo
                        hide-details
                        v-model="actions.edit.price.value"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false"> Отмена </v-btn>

                  <v-btn
                    color="success"
                    class="ma-0 ml-4"
                    :loading="actions.edit.price.pending"
                    :disabled="!checkEditPrice"
                    @click="priceEdit(dialog)"
                  >
                    Применить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-btn
            v-if="selecteditem.data.actions.priceGenerate"
            color="#ff9800"
            x-large
            dark
            class="ml-8"
            :loading="actions.priceList.pending"
            v-on:click="priceListGenerate"
          >
            <v-icon left> mdi-format-list-bulleted </v-icon>
            Прайс-лист
          </v-btn>
        </template>

        <v-spacer></v-spacer>

        <!--<v-menu
                bottom
                left
                offset-y
                origin="top right"
                transition="scale-transition"
            >
                <template v-slot:activator="{ attrs, on }">
                    <v-btn
                        class="ml-2"
                        min-width="0"
                        text
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-badge
                            color="red"
                            overlap
                            bordered
                        >
                            <template v-slot:badge>
                                <span>5</span>
                            </template>
                            <v-icon>mdi-bell</v-icon>
                        </v-badge>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item>
                        <v-list-item-title>Option 1</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Option 2</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Option 3</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>-->

        <v-select
          style="max-width: 80px"
          v-model="selectLang"
          :items="getLangs"
          hide-details
          item-value="local"
          item-text="local"
          label="Язык"
          color="green"
          solo
          dense
        ></v-select>
        <a href="/" target="_blank" style="text-decoration: unset">
          <v-btn class="ml-2" min-width="0" text>
            <v-icon>mdi-home-export-outline</v-icon>
          </v-btn>
        </a>

        <v-menu
          bottom
          left
          offset-y
          origin="top right"
          transition="scale-transition"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item v-on:click.prevent="logout">Выйти</v-list-item>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-main>
        <!-- <keep-alive>
        <component
          :is="selecteditem.data.component"
          :chosen="selected"
        ></component>
      </keep-alive> -->
        <slot></slot>
      </v-main>
    </template>
    <v-overlay color="white" :value="overlay">
      <v-progress-circular
        :size="70"
        :width="7"
        color="green"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <Notification />
  </v-app>
</template>

<script>
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
import { LOADING_GET_LANG } from '@/constants/loadingIds'
import Notification from '@/components/Notification'

const { mapGetters: mapGettersAuth, mapActions: mapActionsAuth } =
  createNamespacedHelpers('auth')
const {
  mapGetters: mapGettersLang,
  mapMutations: mapMutationsLang,
  mapActions: mapActionsLang,
} = createNamespacedHelpers('lang')
const { mapGetters: mapGettersLoading } = createNamespacedHelpers('loading')

export default {
  components: { Notification },
  data: function () {
    return {
      location: window.location.origin,
      selectItem: this.$store?.state?.data?.divide || 'settings-base',
      drawer: null,
      user: this.$store?.getters?.userData | {},
      actions: {
        edit: {
          price: {
            direction: null,
            operator: null,
            value: null,
            pending: false,
          },
        },
        priceList: {
          pending: false,
        },
      },
      selected: {
        categories: null,
      },
    }
  },
  watch: {
    // selectItem: function () {
    //   window.history.replaceState(
    //     null,
    //     null,
    //     window.location.origin +
    //       '/home?divide=' +
    //       this.selecteditem.data.component
    //   )
    // },
  },
  beforeMount() {
    this.getLang()
  },
  computed: {
    ...mapGettersAuth(['getUser']),
    ...mapGettersLoading(['getLoadingIds']),
    ...mapGettersLang(['getLangs', 'getSelectLocal']),
    selectLang: {
      get() {
        return this.getSelectLocal
      },
      set(value) {
        this.updateSelectLocal(value)
      },
    },
    overlay() {
      return this.getLoadingIds.includes(LOADING_GET_LANG)
    },
    menus() {
      return [
        {
          title: 'Настройки',
          icon: 'mdi-format-list-bulleted',
          child: [
            {
              title: 'Основное',
              icon: 'mdi-cube-outline',
              component: 'settings-base',
              to: { name: 'Base' },
            },
            {
              title: 'Валюты',
              icon: 'mdi-currency-usd',
              component: 'settings-currency',
              to: { name: 'Currency' },
            },
            {
              title: 'Меню',
              icon: 'mdi-menu-open',
              component: 'settings-menu',
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
              component: 'store-categories',
              actions: {
                priceGenerate: true,
              },
              to: { name: 'StoreCategories' },
            },
            {
              title: 'Группы',
              icon: 'mdi-animation',
              component: 'store-groups',
              filter: {
                key: 'categories',
                items: this.getCategories,
              },
              to: { name: 'StoreGroups' },
            },
            {
              title: 'Коллекции',
              icon: 'mdi-rhombus-split',
              component: 'store-collection',
              filter: {
                key: 'categories',
                items: this.getCategories,
              },
              to: { name: 'StoreCollections' },
            },
            {
              title: 'Атрибуты',
              icon: 'mdi-tag-multiple-outline',
              component: 'store-attributes',
              to: { name: 'StoreAttributes' },
            },
            {
              title: 'Товары',
              icon: 'mdi-unity',
              component: 'store-products',
              actions: {
                priceEdit: true,
              },
              filter: {
                key: 'categories',
                items: this.getCategories.filter((item) => {
                  return !item.is_root
                }),
              },
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
        //       component: 'services-groups',
        //       filter: {
        //         key: 'categories',
        //         items:
        //           this.$store?.getters?.servicesData?.available?.categories ||
        //           [],
        //       },
        //     },
        //     {
        //       title: 'Атрибуты',
        //       icon: 'mdi-tag-multiple-outline',
        //       component: 'services-attributes',
        //     },
        //     {
        //       title: 'Товары',
        //       icon: 'mdi-unity',
        //       component: 'services-products',
        //       actions: {
        //         priceEdit: true,
        //       },
        //       filter: {
        //         key: 'categories',
        //         items:
        //           this.$store?.getters?.servicesData?.available?.categories ||
        //           [],
        //       },
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
        //       component: 'content-groups',
        //       filter: {
        //         key: 'categories',
        //         items:
        //           this.$store?.getters?.contentData?.available?.categories ||
        //           [],
        //       },
        //     },
        //     {
        //       title: 'Записи',
        //       icon: 'mdi-content-paste',
        //       component: 'content-articles',
        //       filter: {
        //         key: 'categories',
        //         items:
        //           this.$store?.getters?.contentData?.available?.categories ||
        //           [],
        //       },
        //     },
        //     {
        //       title: 'Страницы',
        //       icon: 'mdi-format-page-break',
        //       component: 'content-pages',
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
              component: 'crm-orders',
            },
            {
              title: 'Услуги',
              icon: 'mdi-unity',
              component: 'crm-services',
              to: { name: 'CRMService' },
            },
            {
              title: 'Пользователи',
              icon: 'mdi-account-edit-outline',
              component: 'crm-users',
            },
          ],
        },
      ]
    },
    getCategories() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      // return this.$store.getters.storeData.available.categories.sort((a, b) => {
      //   return Number(b.is_root) - Number(a.is_root)
      // })
      return []
    },
    // eslint-disable-next-line vue/return-in-computed-property
    selecteditem() {
      for (let i = 0; i < this.menus.length; i++) {
        var index = i,
          menu = this.menus[i].child

        for (let i = 0; i < menu.length; i++) {
          let item = menu[i]
          if (item.component === this.selectItem) {
            if (item.filter && item.filter.items.length) {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.selected[item.filter.key] = item.filter.items[0].id
            }
            return {
              data: item,
              menu: index,
            }
          }
        }
      }
    },
    checkEditPrice() {
      const actions = this.actions.edit.price
      return actions.direction && actions.operator && actions.value
    },
  },
  filters: {
    firstLetter: function (value) {
      return value ? value[0] : ''
    },
  },
  methods: {
    ...mapActionsAuth(['logoutUser']),
    ...mapActionsLang(['getLang']),
    ...mapMutationsLang(['updateSelectLocal']),
    logout: function () {
      this.logoutUser().then(() => this.$router.push({ name: 'Login' }))
    },
    priceListGenerate() {
      this.actions.priceList.pending = true

      axios
        .get(window.location.pathname + '/products/export')
        .then((response) => {
          window.location = response.data
        })
        .catch(() => {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Внимание!',
            text: 'Произошла ошибка, обновите страницу и попробуйте еще раз',
          })
        })
        .finally(() => {
          this.actions.priceList.pending = false
        })
    },
    priceEdit(dialog) {
      this.actions.edit.price.pending = true
      const { direction, operator, value } = this.actions.edit.price

      axios
        .post(window.location.pathname + '/products/update-price', {
          ...{ direction, operator, value },
          category: this.selected.categories,
        })
        .then(() => {
          this.$root.reloadData += 1

          dialog.value = false

          this.actions.edit.price.direction = null
          this.actions.edit.price.operator = null
          this.actions.edit.price.value = null

          this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Успешно!',
            text: 'Данные успешно обновлены',
          })
        })
        .catch(() => {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Внимание!',
            text: 'Произошла ошибка, обновите страницу',
          })
        })
        .finally(() => {
          this.actions.edit.price.pending = false
        })
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
