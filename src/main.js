import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import '@/assets/scss/index.scss'
import '@/assets/css/confirm.css'
import '@/plugins/notifications'
import '@/plugins/vee-validate'
import '@/plugins/ckeditor'
import config from '@/mixins/confirm'

Vue.config.productionTip = false

Vue.mixin(config)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
