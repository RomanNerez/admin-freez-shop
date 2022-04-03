<template>
  <v-autocomplete
    label="Категория:"
    class="nav__filter"
    filled
    color="#4bb04f"
    v-model="selectCategories"
    :items="getCategories"
    item-text="content.ru.title"
    item-value="id"
    no-data-text="Нет совпадений..."
  ></v-autocomplete>
</template>

<script>
import { createNamespacedHelpers, mapGetters, mapMutations } from 'vuex'

const { mapGetters: mapGettersStoreCategories } =
  createNamespacedHelpers('store/categories')

export default {
  computed: {
    ...mapGettersStoreCategories(['getCategories']),
    ...mapGetters(['getSelectCategories']),
    selectCategories: {
      get() {
        return this.getSelectCategories
      },
      set(value) {
        this.updateSelectCategories(value)
      },
    },
  },
  mounted() {
    this.updateSelectCategories(this.getCategories[0]?.id)
  },
  methods: {
    ...mapMutations(['updateSelectCategories']),
  },
}
</script>
