<template>
  <v-col>
    <v-snackbar
      v-model="alert.show"
      absolute
      top
      right
      elevation="24"
      :color="alertColor"
      :timeout="alert.option.type === 'loading' ? -1 : 4000"
    >
      {{ alert.option.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :loading="alert.option.type === 'loading'"
          color="white"
          text
          v-bind="attrs"
          @click="alert.show = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>

    <v-container fluid tag="section" v-if="1">
      <list
        :items="list"
        :select.sync="selected"
        :formState.sync="formDialog"
        :edit="edit"
        :edt.sync="edt"
        :langs="getLangs"
        :related="related"
        :alert.sync="alert.option"
        :total="total"
        :loading="loading"
        v-on:confirm="() => {}"
        ref="listTable"
      />

      <editor
        :formDialog.sync="formDialog"
        :edit.sync="edit"
        :selected.sync="selected"
        :parent="1"
        :edt.sync="edt"
        :related="related"
        :available="available"
        :components="components"
      />
    </v-container>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
import List from './Products/List.vue'
import Editor from './Products/EditModalRight/Editor.vue'
import { DATA } from '@/router/paths-api'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')

export default {
  props: ['chosen'],
  components: {
    list: List,
    editor: Editor,
  },
  data: function () {
    return {
      related: 'store',
      actions: {
        list: DATA.STORE.PRODUCTS.LIST,
      },
      items: [],
      available: {
        root: true,
      },
      alert: {
        show: false,
        option: {
          type: null,
          text: null,
        },
      },
      selected: null,
      formDialog: false,
      edit: {},
      loading: false,
      total: 0,
      list: [],
      edt: false,
      components: [
        {
          c: 'chose-attr',
          t: 'атрибуты',
          o: {
            disabled: {
              lang: true,
            },
          },
        },
        {
          c: 'chose-groups',
          t: 'группы',
          o: {
            disabled: {
              lang: true,
            },
          },
        },
        {
          c: 'price-count',
          t: 'цена и количество',
          o: {
            disabled: {
              lang: true,
            },
          },
        },
        {
          c: 'set-media',
          t: 'изображения',
          o: {
            disabled: {
              lang: true,
            },
          },
        },
        {
          c: 'content-item',
          t: 'контент',
        },
        {
          c: 'params-item',
          t: 'характеристики',
        },
        {
          c: 'option-item',
          t: 'опции',
        },
        {
          c: 'meta-item',
          t: 'meta данные',
        },
      ],
    }
  },
  watch: {
    selected: function (a) {
      if (a) {
        for (let i = 0; i < this.list.length; i++) {
          let item = this.list[i]
          if (item.id === a) {
            this.edit = JSON.parse(JSON.stringify(item))
            break
          }
        }
        setTimeout(() => {
          this.edt = false
        }, 100)
      } else {
        this.edit = {}
        setTimeout(() => {
          this.edt = false
        }, 100)
      }
    },
    // 'chosen.categories': function () {
    //   this.getData()
    // },
    'alert.option': {
      deep: true,
      handler: function () {
        this.alert.show = true
      },
    },
    isReload() {
      this.getData()
    },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    isReload() {
      return this.$root.reloadData
    },
    alertColor: function () {
      switch (this.alert.option.type) {
        case 'loading':
          return 'blue darken-1'
        default:
          return this.alert.option.type
      }
    },
  },
  methods: {
    getData() {
      let sort = 'desc'
      const { sortBy, sortDesc, page, itemsPerPage } =
        this.$refs.listTable.options
      const filter = this.$refs.listTable.filter

      if (sortDesc.length && !sortDesc[0]) {
        sort = 'asc'
      }

      this.loading = true

      axios
        .get(this.actions.list, {
          params: {
            category: 1,
            by: sortBy[0],
            sort: sort,
            page: page,
            per_page: itemsPerPage,
            search: filter.search,
            status: filter.status,
          },
        })
        .then((response) => {
          const resp = response.data

          this.total = resp.items.total
          this.list = resp.items.data
        })
        .catch(() => {
          this.alert.option = {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
