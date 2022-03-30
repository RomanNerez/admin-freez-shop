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
      <List :alert.sync="alert.option" />

      <Editor v-if="getFormDialog" />
    </v-container>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import List from './Categories/List.vue'
import Editor from './Categories/EditModalRight/Editor.vue'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const {
  mapGetters: mapGettersStoreCategories,
  mapActions: mapActionsStoreCategories,
} = createNamespacedHelpers('store/categories')

export default {
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
    }
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersStoreCategories(['getCategories', 'getFormDialog']),
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
    ...mapActionsStoreCategories({ getCategoriesAction: 'getCategories' }),
  },
}
</script>
