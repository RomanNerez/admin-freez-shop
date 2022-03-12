<template>
  <div>
    <v-snackbar
      v-model="getOptions.show"
      :absolute="getOptions.absolute"
      :top="getOptions.top"
      :right="getOptions.right"
      :elevation="getOptions.elevation"
      :color="getOptions.color"
      :timeout="getOptions.timeout"
    >
      {{ getOptions.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :loading="getOptions.btn.loading"
          :color="getOptions.btn.color"
          text
          v-bind="attrs"
          @click="getOptions.show = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('notification')

export default {
  computed: {
    ...mapGetters(['getOptions']),
  },
}
</script>
