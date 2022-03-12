<template>
  <v-overlay :value="getFormDialog" class="b-overlay" z-index="7">
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
              v-model.trim="input.status"
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
              v-on:click="createOrEditCurrency"
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
            <CurrencyBase v-model="input" v-show="tabSelect === 0" ref="base" />
            <CurrencyInfo
              v-model="input.content"
              v-show="tabSelect === 1"
              ref="info"
              :local="lang"
            />
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
import {
  LOADING_CREATE_CURRENCY,
  LOADING_EDIT_CURRENCY,
} from '@/constants/loadingIds'

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
      formDialog: false,
      isEdit: false,
      input: {
        symbol: '',
        code: '',
        status: 1,
        content: {},
      },
    }
  },
  watch: {
    input: {
      deep: true,
      handler() {
        this.isEdit = true
      },
    },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersCurrency(['getFormDialog', 'getEditCurrency']),
    ...mapGettersLoading(['getLoadingIds']),
    loadingBtn() {
      return (
        this.getLoadingIds.includes(LOADING_CREATE_CURRENCY) ||
        this.getLoadingIds.includes(LOADING_EDIT_CURRENCY)
      )
    },
  },
  mounted() {
    setTimeout(() => {
      this.formDialog = this.getFormDialog
      html_hidden('editor')
      this.isEdit = false
    }, 10)
    if (this.getEditCurrency) this.input = this.getEditCurrency
  },
  methods: {
    ...mapMutationsCurrency(['updateFormDialog']),
    ...mapActionsCurrency(['createCurrency', 'editCurrency']),
    closeModal(e) {
      if (this.isEdit) {
        this.__confirm(e, 'set_editor', () => {
          this.updateFormDialog(false)
        })
        return
      }
      this.updateFormDialog(false)
    },
    create(info) {
      if (!info.isValid) {
        setTimeout(this.$refs.form.reset, 3000)
        return
      }
      this.createCurrency(this.input)
    },
    edit(info) {
      if (!info.isValid) {
        setTimeout(this.$refs.form.reset, 3000)
        return
      }
      this.editCurrency(this.input)
    },
    createOrEditCurrency() {
      this.$refs.form
        .validateWithInfo()
        .then(this.getEditCurrency ? this.edit : this.create)
    },
  },
}
</script>
