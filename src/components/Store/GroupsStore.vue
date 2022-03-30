<template>
  <v-container fluid tag="section" class="pa-6 full-height">
    <v-snackbar
      v-model="alert.show"
      absolute
      bottom
      center
      elevation="24"
      :color="alertColor"
      :timeout="alert.option.type === 'loading' ? -1 : 4000"
    >
      <span v-html="alert.option.text"></span>

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

    <list
      :items="data"
      :selected.sync="selected"
      :formState.sync="formDialog"
      :categories="20"
      :action.sync="action"
      :edit="edit"
      :edt.sync="edt"
      :langs="getLangs"
      :related="related"
      :alert.sync="alert.option"
      v-on:confirm="() => {}"
    >
    </list>

    <editor
      :formDialog.sync="formDialog"
      :edit.sync="edit"
      :selected.sync="selected"
      :action.sync="action"
      :parent="getParentId"
      :edt.sync="edt"
      :alert.sync="alertActive"
      :related="related"
      :available="available"
      :components="components"
    >
    </editor>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import List from './Groups/List.vue'
import Editor from './Groups/EditModalRight/Editor.vue'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersStoreGroups, mapActions: mapActionsStoreGroups } =
  createNamespacedHelpers('store/groups')

export default {
  props: ['chosen'],
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
      selected: {
        section: null,
        id: null,
      },
      action: {
        section: null,
        type: null,
      },
      formDialog: false,
      edit: {},
      edt: false,
      alertActive: false,
      langs: [],
      components: [
        {
          c: 'base-form',
          t: 'осн. данные',
        },
        {
          c: 'meta-form',
          t: 'meta данные',
        },
      ],
    }
  },
  beforeMount() {
    this.findGroups()
  },
  watch: {
    formDialog: function () {
      let selected = this.selected.id

      if (selected && this.action.type === 'edit') {
        let data = null

        for (let i = 0; i < this.list.length; i++) {
          let group = this.list[i]

          if (this.selected.section === 'subs') {
            for (let i = 0; i < group.subs.length; i++) {
              let subs = group.subs[i]

              if (subs.id === selected) {
                data = subs
                break
              }
            }
          } else if (group.id === selected) {
            data = group
          }
          if (data) {
            break
          }
        }
        this.edit = JSON.parse(JSON.stringify(data))
      } else {
        this.edit = {}
      }

      setTimeout(() => {
        this.edt = false
      }, 100)
    },
    'chosen.categories': function () {
      this.selected = {
        section: null,
        id: null,
      }
    },
    'alert.option': {
      deep: true,
      handler: function () {
        if (this.alert.option.type && this.alert.option.text) {
          this.alert.show = true
        }
      },
    },
    'alert.show': function () {
      if (!this.alert.show) {
        setTimeout(() => {
          this.alert.option = {
            type: null,
            text: null,
          }
        }, 200)
      }
    },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersStoreGroups(['getGroups']),
    list: function () {
      return this.getGroups
    },
    alertColor: function () {
      switch (this.alert.option.type) {
        case 'loading':
          return 'blue darken-1'
        case 'warning':
          return 'orange darken-1'
        default:
          return this.alert.option.type
      }
    },
    data: function () {
      return this.list.filter((item) => {
        return item.categories_id === 20
      })
    },
    getParentId: function () {
      return this.action.section === 'groups'
        ? this.chosen.categories
        : this.selected.id
    },
  },
  methods: {
    ...mapActionsStoreGroups(['findGroups']),
  },
}
</script>
