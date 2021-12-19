<template>
  <v-app>
    <div id="particles-js"></div>
    <v-main>
      <v-container fluid fill-height>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import 'particles.js'
import particlesJSON from '@/assets/particles.json'

export default {
  data: () => ({}),
  mounted() {
    window.particlesJS('particles-js', particlesJSON, function () {
      console.log('callback - particles-js config loaded')
    })
  },
}
</script>

<style scoped>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #2c2e43;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
</style>
