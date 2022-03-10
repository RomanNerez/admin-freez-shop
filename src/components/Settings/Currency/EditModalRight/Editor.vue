<template>
  <v-overlay
    v-if="getFormDialog"
    :value="getFormDialog"
    class="b-overlay"
    z-index="7"
  >
    <div class="b-drawer b-drawer--right" :class="{ active: formDialog }">
      <v-card light class="b-new-category rounded-0 mt-0 mb-0 b-new-article">
        <v-form>
          <v-card-title class="px-0 pt-0">
            <v-select
              style="margin-right: 5% !important"
              :disabled="tabSelect !== 1"
              class="b-lang"
              v-model="lang"
              :items="getLangs"
              item-value="local"
              item-text="title"
              label="Язык"
              color="green"
              solo
            ></v-select>
            <v-select
              disabled
              class="b-lang"
              v-model.trim="status"
              :items="STATUSES"
              item-value="key"
              color="green"
              item-text="caption"
              label="Статус"
              solo
            ></v-select>

            <v-btn
              :loading="pending"
              class="b-btn"
              color="green darken-1"
              v-on:click="editCategory"
            >
              Сохранить
            </v-btn>
            <v-btn
              class="b-close"
              large
              color="red"
              icon
              v-on:click="closeModal($event)"
            >
              <icon-close-model></icon-close-model>
            </v-btn>
          </v-card-title>

          <template>
            <v-tabs class="b-tabs" color="green" v-model="tabSelect">
              <v-tab
                v-for="(title, index) in ['осн. данные', 'локализация']"
                :key="index"
              >
                {{ 'Шаг ' + (index + 1) }}
                <span>{{ title }}</span>
              </v-tab>
            </v-tabs>
          </template>
          <ValidationObserver ref="form">
            <CurrencyBase v-show="tabSelect === 0" :local="lang" />
            <CurrencyInfo v-show="tabSelect === 1" :local="lang" />
          </ValidationObserver>
        </v-form>
      </v-card>
      <template>
        <div class="text-center ma-2">
          <v-snackbar v-model="snackbar.show">
            <span v-html="snackbar.text"></span>
            <template v-slot:action="{ attrs }">
              <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="snackbar.show = false"
              >
                Закрыть
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </template>
    </div>
  </v-overlay>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import html_hidden from '@/helpers/html_hidden'
import { STATUSES } from '@/constants/common-statuses'
import CurrencyBase from './CurrencyBase.vue'
import CurrencyInfo from './CurrencyInfo.vue'
import IconCloseModel from '@/components/IconCloseModel.vue'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersCurrency, mapMutations: mapMutationsCurrency } =
  createNamespacedHelpers('settings/currency')

export default {
  components: {
    CurrencyBase,
    CurrencyInfo,
    IconCloseModel,
    ValidationObserver,
  },
  data: function () {
    return {
      tabSelect: 0,
      pending: false,
      lang: process.env.VUE_APP_I18N_LOCALE,
      STATUSES,
      snackbar: {
        show: false,
        text: '',
      },
      status: 1,
      formDialog: false,
    }
  },
  watch: {
    getFormDialog(a) {
      setTimeout(() => {
        this.formDialog = a
        html_hidden('editor')
      }, 10)
    },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersCurrency(['getFormDialog']),
    getLocal() {
      return this.getLangs[0].local
    },
    getComponent() {
      return this.components
    },
  },
  methods: {
    ...mapMutationsCurrency(['updateFormDialog']),
    closeModal(e) {
      this.__confirm(e, 'set_editor', () => {
        this.updateFormDialog(false)
      })
    },
    editCategory() {
      this.$refs.form.validateWithInfo().then((check) => {
        const data = {
          code: '',
          symbol: '',
          status: 1,
          content: {
            ru: {
              name: 'test',
              abbrev: 'test',
            },
            ua: {
              name: 'test',
              abbrev: 'test',
            },
          },
        }
        console.log(check, data)
        setTimeout(this.$refs.form.reset, 3000)
      })
      // if (!this.validate()) {
      //   return
      // }
      // let input = this.editor,
      //   path = window.location.pathname + '/currency/',
      //   url = this.selected ? path + 'edit' : path + 'create'
      // this.pending = true
      // axios
      //   .post(url, {
      //     _token: window._token,
      //     data: input,
      //   })
      //   .then((response) => {
      //     setTimeout(() => {
      //       if (this.selected) {
      //         this.$store.commit('editCurrencyList', input)
      //       } else {
      //         this.$store.commit('addCurrencyList', response.data)
      //       }
      //       this.editor = {
      //         code: '',
      //         symbol: '',
      //         status: 1,
      //       }
      //       this.setup()
      //       this.$emit('update:formDialog', false)
      //       this.$emit('update:selected', null)
      //       //this.$v.reset();
      //     }, 200)
      //   })
      //   .catch((error) => {
      //     let data = error.response.data
      //     if (data.errors) {
      //       this.snackbar.text = Object.values(data.errors)[0][0]
      //     } else if (data.message) {
      //       this.snackbar.text = data.message
      //     } else {
      //       this.snackbar.text = 'Неизвестная ошибка, повторите попытку'
      //     }
      //     this.snackbar.show = true
      //   })
      //   .finally(() => {
      //     this.pending = false
      //     setTimeout(() => {
      //       this.$emit('update:edt', false)
      //     }, 300)
      //   })
    },
  },
}
</script>
