<template>
  <v-overlay :value="getFormDialog" class="b-overlay" z-index="7">
    <div class="b-drawer b-drawer--right" :class="{ active: formDialog }">
      <v-card light class="b-new-category rounded-0 mt-0 mb-0 b-new-article">
        <v-form>
          <v-card-title class="px-0 pt-0">
            <v-select
              style="margin-right: 5% !important"
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
              class="b-lang"
              v-model.trim="input.status"
              :items="STATUSES"
              item-value="key"
              color="green"
              item-text="caption"
              label="Статус"
              solo
            ></v-select>

            <v-checkbox
              style="margin-top: 0"
              class="b-lang"
              color="success"
              v-model="input.is_root"
              label="Глобальная категория"
              hide-details
            ></v-checkbox>

            <v-btn
              :loading="pending"
              class="b-btn"
              color="green darken-1"
              v-on:click="saveCategory"
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
                v-for="(component, index) in ['осн. данные', 'meta данные']"
                :key="index"
              >
                {{ 'Шаг ' + (index + 1) }}
                <span>{{ component }}</span>
              </v-tab>
            </v-tabs>
          </template>
          <ValidationObserver ref="form">
            <CreateBase v-show="tabSelect == 0" v-model="input" :local="lang" />
            <CreateMeta v-show="tabSelect == 1" v-model="input" :local="lang" />
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
import { iLang } from '@/interfaces/iLang'
import { STATUSES } from '@/constants/common-statuses'
import CreateBase from './CreateBase.vue'
import CreateMeta from './CreateMeta.vue'
import IconCloseModel from '@/components/IconCloseModel.vue'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const {
  mapGetters: mapGettersStoreCategories,
  mapMutations: mapMutationsStoreCategories,
  mapActions: mapActionsStoreCategories,
} = createNamespacedHelpers('store/categories')

export default {
  components: {
    CreateBase,
    CreateMeta,
    IconCloseModel,
    ValidationObserver,
  },
  data: function () {
    return {
      input: {
        content: {},
        slug: '',
        file: '',
        is_root: false,
        status: 0,
        related: 'store',
      },
      tabSelect: 0,
      pending: false,
      STATUSES,
      formDialog: false,
      isEdit: false,
      lang: process.env.VUE_APP_I18N_LOCALE,
    }
  },
  mounted() {
    setTimeout(() => {
      this.formDialog = this.getFormDialog
      html_hidden('editor')
      this.isEdit = false
    }, 10)
  },
  beforeMount() {
    if (this.getEditCategory) {
      this.input = this.getEditCategory
      return
    }
    this.input.content = iLang(this.getLangs, {
      title: '',
      desc: '',
      metaTitle: '',
      metaDesc: '',
    })
  },
  watch: {
    input: {
      deep: true,
      handler() {
        this.isEdit = true
      },
    },
    'input.is_root'() {
      if (this.input.is_root && !this.input.status) {
        this.input.status = 1
      }
    },
    'input.status'() {
      if (this.input.is_root && !this.input.status) {
        this.input.is_root = false
      }
    },
  },
  destroyed() {
    html_hidden('editor')
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersStoreCategories(['getFormDialog', 'getEditCategory']),
  },
  methods: {
    ...mapMutationsStoreCategories(['updateFormDialog', 'updateEditCategory']),
    ...mapActionsStoreCategories(['createCategory', 'editCategory']),
    closeModal(e) {
      if (this.isEdit) {
        this.__confirm(e, 'set_editor', () => {
          this.updateFormDialog(false)
          this.updateEditCategory(null)
        })

        return
      }
      this.updateFormDialog(false)
    },
    saveCategory() {
      const callback = this.getEditCategory
        ? this.editCategory
        : this.createCategory

      callback(this.input)
      // if (!this.validate()) {
      //   return
      // }
      // var s = this.selected,
      //   input = this.editor,
      //   url = s ? '/home/category/edit' : '/home/category/create'
      // input.related = this.related
      // this.pending = true
      // axios
      //   .post(url, {
      //     _token: window._token,
      //     data: input,
      //   })
      //   .then((response) => {
      //     setTimeout(() => {
      //       var data = response.data
      //       if (data.category) {
      //         this.$store.commit('addCategories', data.category)
      //       } else {
      //         for (var i = 0; i < this.list.length; i++) {
      //           var item = this.list[i]
      //           if (item.id === input.id) {
      //             input.updated_at = data.updated_at
      //             this.$store.commit('editCategories', {
      //               index: i,
      //               input: input,
      //             })
      //           }
      //         }
      //       }
      //       this.editor = {
      //         file: '',
      //         slug: '',
      //         is_root: false,
      //         status: 0,
      //       }
      //       this.setup()
      //       this.$emit('update:selected', null)
      //       this.$emit('update:formDialog', false)
      //       //this.$v.reset();
      //     }, 200)
      //   })
      //   .catch((error) => {
      //     this.snackbar.show = true
      //     if (error.response && error.response.data.message) {
      //       this.snackbar.text = error.response.data.message
      //     } else {
      //       this.snackbar.text = 'Неизвестная ошибка, повторите попытку'
      //     }
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
