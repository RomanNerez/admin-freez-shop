import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import IconGoogle from '@/components/IconGoogle.vue'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    values: {
      'custom-icon-google': {
        component: IconGoogle,
      },
    },
  },
})
