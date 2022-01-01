<template>
  <div id="app">
    <component v-if="$route.meta.layout" :is="layout">
      <router-view></router-view>
    </component>
    <notifications class="custom-notification" group="foo" />
  </div>
</template>

<script>
import { DEFAULT_LAYOUT } from './constants/layout'
import Default from '@/layouts/default.layout.vue'
import Auth from '@/layouts/auth.layout.vue'

export default {
  components: {
    Default,
    Auth,
  },
  data: () => ({
    DEFAULT_LAYOUT,
  }),
  computed: {
    layout() {
      return this.$route.meta.layout ?? DEFAULT_LAYOUT
    },
  },
}
</script>

<style>
.custom-notification {
  top: 10px !important;
}
</style>
