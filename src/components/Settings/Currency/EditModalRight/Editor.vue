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
              :loading="loadingBtn"
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
            <CurrencyBase v-show="tabSelect === 0" ref="base" :local="lang" />
            <CurrencyInfo v-show="tabSelect === 1" ref="info" :local="lang" />
          </ValidationObserver>
        </v-form>
      </v-card>
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
import { LOADING_CREATE_CURRENCY } from '@/constants/loadingIds'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersLoading } = createNamespacedHelpers('loading')
const {
  mapGetters: mapGettersCurrency,
  mapMutations: mapMutationsCurrency,
  mapActions: mapActionsCurrency,
} = createNamespacedHelpers('settings/currency')

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
    ...mapGettersLoading(['getLoadingIds']),
    loadingBtn() {
      return this.getLoadingIds.includes(LOADING_CREATE_CURRENCY)
    },
  },
  methods: {
    ...mapMutationsCurrency(['updateFormDialog']),
    ...mapActionsCurrency(['createCurrency']),
    closeModal(e) {
      this.__confirm(e, 'set_editor', () => {
        this.updateFormDialog(false)
      })
    },
    create(info) {
      if (!info.isValid) {
        setTimeout(this.$refs.form.reset, 3000)
        return
      }
      const data = {
        code: this.$refs.base.code,
        symbol: this.$refs.base.code,
        status: 1,
        content: this.$refs.info.content,
      }
      this.createCurrency(data)
    },
    editCategory() {
      this.$refs.form.validateWithInfo().then(this.create)
    },
  },
}
</script>
