<template>
  <v-col>
    <validation-observer ref="observer">
      <v-container fluid tag="section">
        <v-row v-if="!overlay">
          <Socialize ref="socialize" />
          <AddressShop ref="address-shop" />
          <Contacts ref="contacts" />
          <DataShop ref="datashop" />
          <Delivery ref="delivery" />
        </v-row>
        <v-sheet
          v-else
          class="d-flex justify-center align-center"
          color="grey lighten-3"
          height="550"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-sheet>
      </v-container>
    </validation-observer>
    <div class="save-options-store">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            class="mx-2"
            fab
            dark
            large
            color="green"
            v-on="on"
            @click="update"
            :disabled="alert.option.type === 'loading'"
          >
            <v-icon dark> mdi-content-save-outline </v-icon>
          </v-btn>
        </template>
        <span>Обновить данные</span>
      </v-tooltip>
    </div>
    <v-snackbar
      v-model="alert.show"
      fixed
      top
      right
      elevation="24"
      :color="alertColor"
      :timeout="alert.option.type === 'loading' ? -1 : 4000"
    >
      {{ alert.option.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :loading="alert.option.type === 'loading'"
          color="white"
          text
          v-bind="attrs"
          @click="alert.show = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
import { ValidationObserver, extend } from 'vee-validate'
import Socialize from './Base/Socialize.vue'
import AddressShop from './Base/AddressShop.vue'
import Contacts from './Base/Contacts.vue'
import DataShop from './Base/DataShop.vue'
import Delivery from './Base/Delivery.vue'
import { required } from 'vee-validate/dist/rules'
import { LOADING_GET_OPTIONS } from '@/constants/loadingIds'
import { DATA } from '@/router/paths-api'

extend('required', required)

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const {
  mapGetters: mapGettersSettings,
  mapMutations: mapMutationsSettings,
  mapActions: mapActionsSettings,
} = createNamespacedHelpers('settings/options')
const { mapGetters: mapGettersLoading } = createNamespacedHelpers('loading')

export default {
  name: 'BaseSettings',
  props: ['chosen'],
  components: {
    ValidationObserver,
    Socialize,
    AddressShop,
    Contacts,
    DataShop,
    Delivery,
  },
  data: function () {
    return {
      alert: {
        show: false,
        option: {
          type: null,
          text: null,
        },
      },
      location: window.location.origin,
      langs: {
        items: this.$store.state?.data?.langs || [],
        select: 1,
      },
    }
  },
  watch: {
    'alert.option': {
      deep: true,
      handler() {
        this.alert.show = true
      },
    },
  },
  beforeMount() {
    this.findOptions()
  },
  computed: {
    ...mapGettersLang(['getLangs', 'getSelect']),
    ...mapGettersSettings(['getOptions']),
    ...mapGettersLoading(['getLoadingIds']),
    overlay() {
      return this.getLoadingIds.includes(LOADING_GET_OPTIONS)
    },
    alertColor() {
      switch (this.alert.option.type) {
        case 'loading':
          return 'blue darken-1'
        default:
          return this.alert.option.type
      }
    },
    data() {
      const content = {}
      this.getLangs.forEach(({ local }) => {
        content[local] = {
          ...this.getOptions.content[local],
          ...this.$refs.delivery.content[local],
          ...this.$refs.datashop.content[local],
          addr: {
            ...this.$refs['address-shop'].content[local],
          },
        }
      })
      return {
        ...this.getOptions,
        content,
        socials: this.$refs.socialize.socials,
        delivery: this.$refs.delivery.delivery,
        emails: this.$refs.contacts.emails,
        phones: this.$refs.contacts.phones,
        logo_color: this.$refs.datashop.logo_color,
        logo_dark: this.$refs.datashop.logo_dark,
        logo_light: this.$refs.datashop.logo_light,
      }
    },
  },
  methods: {
    ...mapMutationsSettings(['updateOptions']),
    ...mapActionsSettings(['findOptions']),
    update: function () {
      this.$refs.observer.validate().then((check) => {
        for (let i = 0; i < this.getLangs.length; i++) {
          let local = this.getLangs[i].local,
            lang = this.getLangs[i].id

          for (let key in this.data.content[local]) {
            let item = this.data.content[local][key]

            if (key !== 'addr') {
              if (!item) {
                this.langs.select = lang
                return
              } else if (typeof item === 'object' && item.length) {
                for (let ii = 0; ii < item.length; ii++) {
                  let values = item[ii]
                  if (!values.name) {
                    this.langs.select = lang
                    return
                  }
                }
              }
            } else {
              for (let name in this.data.content[local][key]) {
                let addr = this.data.content[local][key][name]

                if (!addr) {
                  this.langs.select = lang
                  return
                }
              }
            }
          }
        }

        if (check) {
          let data = JSON.parse(JSON.stringify(this.data))

          if (data.socials) {
            data.socials = data.socials.filter((item) => {
              return item.image && item.link && item.name
            })
          }

          this.alert.option.type = 'loading'
          this.alert.option.text = 'Обновление данных...'

          axios
            .post(DATA.SETTINGS.OPTIONS_UPDATE, {
              input: data,
            })
            .then((response) => {
              this.updateOptions(response.data)

              this.alert.option.type = 'success'
              this.alert.option.text = 'Данные успешно обновлены'
            })
            .catch(() => {
              this.alert.option.type = 'error'
              this.alert.option.text = 'Неизвестная ошибка, повторите попытку'
            })
        }
      })
    },
  },
}
</script>
