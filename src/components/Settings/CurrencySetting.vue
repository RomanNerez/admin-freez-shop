<template>
  <v-col>
    <v-container fluid tag="section">
      <list
        :select.sync="selected"
        :edit="edit"
        :edt.sync="edt"
        :alert.sync="alert.option"
        v-on:confirm="() => $root.confirmAction"
      >
      </list>
    </v-container>

    <Editor />
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import List from './Currency/List.vue'
import Editor from './Currency/EditModalRight/Editor.vue'

const { mapActions: mapActionsCurrency } =
  createNamespacedHelpers('settings/currency')

export default {
  name: 'CurrencySetting',
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
      loading: false,
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
    alertColor() {
      switch (this.alert.option.type) {
        case 'loading':
          return 'blue darken-1'
        default:
          return this.alert.option.type
      }
    },
  },
  beforeMount() {
    this.getCurrency()
  },
  methods: {
    ...mapActionsCurrency(['getCurrency', 'createCurrency']),
  },
}
</script>
