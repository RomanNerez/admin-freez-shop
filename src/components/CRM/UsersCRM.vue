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

    <v-container fluid tag="section">
      <list
        :select.sync="selected"
        :formState.sync="formDialog"
        :alert.sync="alert.option"
        ref="ordersList"
      >
      </list>

      <editor
        :formDialog.sync="formDialog"
        :edit.sync="edit"
        :selected.sync="selected"
        :edt.sync="edt"
        @updateList="updateList"
      >
      </editor>
    </v-container>
  </v-col>
</template>

<script>
import List from './Users/List.vue'
import Editor from './Users/EditModalRight/Editor.vue'

export default {
  components: {
    list: List,
    editor: Editor,
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
    }
  },
  watch: {
    selected: function (a) {
      if (a) {
        const items = this.$refs.ordersList.items

        this.edit = { ...items.find((item) => item.id === a) }

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
    updateList() {
      this.$refs.ordersList.getList()
    },
  },
}
</script>
