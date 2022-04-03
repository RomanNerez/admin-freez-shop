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

    <v-container fluid tag="section" v-if="20">
      <list
        :items="list"
        :select.sync="selected"
        :formState.sync="formDialog"
        :edit="edit"
        :edt.sync="edt"
        :langs="getLangs"
        :alert.sync="alert.option"
        v-on:confirm="() => {}"
      >
      </list>

      <editor
        :formDialog.sync="formDialog"
        :edit.sync="edit"
        :selected.sync="selected"
        :alert.sync="alertActive"
        :parent="20"
        :edt.sync="edt"
        :components="components"
      >
      </editor>
    </v-container>
  </v-col>
</template>

<script>
import { createNamespacedHelpers, mapGetters } from 'vuex'
import List from './Collections/List.vue'
import Editor from './Collections/EditModalRight/Editor.vue'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const {
  mapGetters: mapGettersStoreCollections,
  mapActions: mapActionsStoreCollections,
} = createNamespacedHelpers('store/collections')
const { mapActions: mapActionsStoreGroups } =
  createNamespacedHelpers('store/groups')

export default {
  props: ['chosen'],
  components: {
    List,
    Editor,
  },
  data: function () {
    return {
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
      edt: false,
      alertActive: false,
      components: [
        {
          c: 'create-base',
          t: 'осн. данные',
        },
        {
          c: 'create-meta',
          t: 'meta данные',
        },
        {
          c: 'chose-subs',
          t: 'группы товаров',
          o: {
            disabled: {
              lang: true,
            },
          },
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
    'alert.option': {
      deep: true,
      handler: function () {
        this.alert.show = true
      },
    },
  },
  computed: {
    ...mapGetters(['getSelectCategories']),
    ...mapGettersLang(['getLangs']),
    ...mapGettersStoreCollections({ getCollectionsGetters: 'getCollections' }),
    list() {
      return this.getCollectionsGetters.filter(
        (collection) => collection.categories_id === this.getSelectCategories
      )
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
  beforeMount() {
    this.findGroups()
    this.getCollections()
  },
  methods: {
    ...mapActionsStoreGroups(['findGroups']),
    ...mapActionsStoreCollections(['getCollections']),
  },
}
</script>
