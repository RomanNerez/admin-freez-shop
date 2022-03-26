<template>
  <v-col>
    <!-- <v-snackbar
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
    </v-snackbar> -->

    <v-container fluid tag="section">
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
        :list="list"
        :edt.sync="edt"
        :related="related"
        :available="available"
        :components="components"
      >
      </editor>
    </v-container>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import List from './Categories/List.vue'
import Editor from './Categories/EditModalRight/Editor.vue'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersCategories, mapActions: mapActionsCategories } =
  createNamespacedHelpers('categories')

export default {
  components: {
    list: List,
    editor: Editor,
  },
  data: function () {
    return {
      related: 'store',
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
      edt: false,
      components: [
        {
          c: 'create-base',
          t: 'осн. данные',
        },
        {
          c: 'create-meta',
          t: 'meta данные',
        },
      ],
    }
  },
  watch: {
    selected(a) {
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
      handler() {
        this.alert.show = true
      },
    },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersCategories(['getCategories']),
    list: function () {
      return this.getCategories
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
    this.getCategoriesAction()
  },
  methods: {
    ...mapActionsCategories({ getCategoriesAction: 'getCategories' }),
  },
}
</script>
