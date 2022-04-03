<template>
  <v-app id="inspire">
    <template v-if="!overlay">
      <Navigation />
      <AppBar />
      <v-main>
        <slot></slot>
      </v-main>
    </template>
    <v-overlay color="white" :value="overlay">
      <v-progress-circular
        :size="70"
        :width="7"
        color="green"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
    <Notification />
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { LOADING_GET_LANG } from '@/constants/loadingIds'
import Notification from '@/components/Notification.vue'
import Navigation from '@/components/Navigation.vue'
import AppBar from '@/components/AppBar.vue'

const { mapActions: mapActionsLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersLoading } = createNamespacedHelpers('loading')

export default {
  components: { Notification, Navigation, AppBar },
  beforeMount() {
    this.getLang()
  },
  computed: {
    ...mapGettersLoading(['getLoadingIds']),
    overlay() {
      return this.getLoadingIds.includes(LOADING_GET_LANG)
    },
  },
  methods: {
    ...mapActionsLang(['getLang']),
  },
}
</script>
