<template>
  <div id="app">
    <component :is="$route.meta.layout ? $route.meta.layout : DEFAULT_LAYOUT">
      <router-view></router-view>
    </component>
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
}
</script>
