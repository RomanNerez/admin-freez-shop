<template>
  <v-col>
    <v-container fluid tag="section">
      <List />
    </v-container>

    <Editor v-if="getFormDialog" />
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import List from './Currency/List.vue'
import Editor from './Currency/EditModalRight/Editor.vue'

const { mapGetters: mapGettersCurrency, mapActions: mapActionsCurrency } =
  createNamespacedHelpers('settings/currency')

export default {
  name: 'CurrencySetting',
  components: {
    List,
    Editor,
  },
  computed: {
    ...mapGettersCurrency(['getFormDialog']),
  },
  beforeMount() {
    this.getCurrency()
  },
  methods: {
    ...mapActionsCurrency(['getCurrency', 'createCurrency']),
  },
}
</script>
