<template>
  <v-btn
    color="#ff9800"
    x-large
    dark
    class="ml-8"
    :loading="loading"
    v-on:click="priceListGenerate"
  >
    <v-icon left> mdi-format-list-bulleted </v-icon>
    Прайс-лист
  </v-btn>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    priceListGenerate() {
      this.loading = true

      axios
        .get(window.location.pathname + '/products/export')
        .then((response) => {
          window.location = response.data
        })
        .catch(() => {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Внимание!',
            text: 'Произошла ошибка, обновите страницу и попробуйте еще раз',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
