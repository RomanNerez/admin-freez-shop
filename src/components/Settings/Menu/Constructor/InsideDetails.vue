<template>
  <div>
    <v-tabs
      v-model="tab"
      height="40px"
      background-color="light-blue darken-1"
      dark
      fixed-tabs
    >
      <v-tab
        class="text-caption"
        style="min-width: 50px"
        :disabled="btnLoading"
      >
        <b>Новые</b>
      </v-tab>
      <v-tab
        class="text-caption"
        style="min-width: 50px"
        :disabled="btnLoading"
      >
        <b>Все</b>
      </v-tab>
      <v-tab
        class="text-caption"
        style="min-width: 50px"
        :disabled="btnLoading"
      >
        <b>Поиск</b>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat class="ma-0 pa-0 elevation-0">
          <v-card-text class="pr-0 pl-0 pb-0 pt-2">
            <v-checkbox
              v-model="dataForMenu"
              v-for="data in getFreshData"
              :key="data.id"
              class="mx-0 my-1 text-caption"
              :label="data.content.ru.title"
              :value="data | getAggregateData(that)"
              hide-details
            ></v-checkbox>

            <v-divider class="mt-3"></v-divider>

            <div class="d-flex align-center justify-space-between">
              <v-checkbox
                v-model="selectAll"
                label="Выбрать всё"
                hide-details
              ></v-checkbox>
              <v-btn
                :disabled="!dataForMenu.length"
                dense
                color="primary"
                class="text-caption mt-4"
                @click="createMenus"
                :loading="btnLoading"
              >
                Добавить
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="ma-0 pa-0 elevation-0">
          <v-card-text class="pr-0 pl-0 pb-0 pt-2">
            <v-checkbox
              v-model="dataForMenu"
              v-for="data in getData"
              :key="data.id"
              class="mx-0 my-1 text-caption"
              :label="data.content.ru.title"
              :value="data | getAggregateData(that)"
              hide-details
            ></v-checkbox>

            <v-divider class="mt-3"></v-divider>

            <div class="d-flex align-center justify-space-between">
              <v-checkbox
                v-model="selectAll"
                label="Выбрать всё"
                hide-details
              ></v-checkbox>
              <v-btn
                :disabled="!dataForMenu.length"
                dense
                color="primary"
                class="text-caption mt-4"
                @click="createMenus"
                :loading="btnLoading"
              >
                Добавить
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card class="ma-0 pa-0 elevation-0">
          <v-card-text class="pr-0 pl-0 pb-0 pt-6">
            <v-text-field
              v-model="search"
              single-line
              dense
              placeholder="Поиск..."
              outlined
              append-icon="mdi-magnify"
            ></v-text-field>
            <template v-if="getSearchData.length">
              <v-checkbox
                v-model="dataForMenu"
                v-for="data in getSearchData"
                :key="data.id"
                class="mx-0 my-1 text-caption"
                :label="data.content.ru.title"
                :value="data | getAggregateData(that)"
                hide-details
              ></v-checkbox>

              <v-divider class="mt-3"></v-divider>

              <div class="d-flex align-center justify-space-between">
                <v-checkbox
                  v-model="selectAll"
                  label="Выбрать всё"
                  hide-details
                ></v-checkbox>
                <v-btn
                  :disabled="!dataForMenu.length"
                  dense
                  color="primary"
                  class="text-caption mt-4"
                  @click="createMenus"
                  :loading="btnLoading"
                >
                  Добавить
                </v-btn>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const {
  mapGetters: mapGettersMenu,
  mapMutations: mapMutationsMenu,
  mapActions: mapActionsMenu,
} = createNamespacedHelpers('settings/menu')
const { mapGetters: mapGettersCategories } =
  createNamespacedHelpers('categories')
const { mapGetters: mapGettersCollections } =
  createNamespacedHelpers('collections')
const { mapGetters: mapGettersPages } = createNamespacedHelpers('pages')

export default {
  props: {
    data: {
      type: String,
      required: true,
    },
    state: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      tab: 0,
      search: '',
      dataForMenu: [],
      that: this,
      btnLoading: false,
    }
  },
  watch: {
    tab: function () {
      this.dataForMenu = []
    },
    getSelectedAreaVisibility: function () {
      this.dataForMenu = []
    },
  },
  computed: {
    ...mapGettersMenu(['getSelectedAreaVisibility']),
    ...mapGettersCategories(['getCategories']),
    ...mapGettersCollections(['getCollections']),
    ...mapGettersPages(['getPages']),
    getDataProps: function () {
      return this.data
    },
    getTestData() {
      switch (this.data) {
        case 'categories':
          return 'getCategories'
        case 'collections':
          return 'getCollections'
        default:
          return 'getPages'
      }
    },
    getData: function () {
      return [...this[this.getTestData]]
    },
    getSearchData: function () {
      return this.getData.filter((item) => {
        if (!/[0-9a-zA-Zа-яёАЯЁ]/gi.test(this.search)) {
          return
        }
        var reg = new RegExp(this.search, 'gi')
        return reg.test(item.content.ru.title)
      })
    },
    getFreshData: function () {
      return this.getData.slice(0, 3)
    },
    getObjectData() {
      switch (this.tab) {
        case 0:
          return 'getFreshData'
        case 1:
          return 'getData'
        case 2:
          return 'getSearchData'
        default:
          return ''
      }
    },
    selectAll: {
      get: function () {
        return this.dataForMenu.length
          ? this.dataForMenu.length == this[this.getObjectData].length
          : false
      },
      set: function (value) {
        var selected = []
        if (value) {
          selected = this[this.getObjectData].map((item) => {
            return this.$options.filters.getAggregateData(item, this)
          })
        }

        this.dataForMenu = selected
      },
    },
  },
  filters: {
    getAggregateData: function (value, that) {
      return {
        instance_id: value.id,
        instance_type: that.getDataProps,
        area_visibility_id: that.getSelectedAreaVisibility,
      }
    },
  },
  methods: {
    ...mapMutationsMenu(['addMenu']),
    ...mapActionsMenu(['createMenu']),
    createMenus: function () {
      this.btnLoading = true
      this.createMenu(this.dataForMenu)
        .then((response) => {
          this.addMenu({
            getSelectedAreaVisibility: this.getSelectedAreaVisibility,
            items: response.data,
          })
          this.dataForMenu = []
        })
        .catch(() => {
          this.$notify({
            group: 'notify',
            title: 'Внимание!',
            test: 'Произошла ошибка, обновите страницу',
          })
        })
        .finally(() => {
          this.btnLoading = false
          this.selectAll = false
        })
    },
  },
}
</script>
