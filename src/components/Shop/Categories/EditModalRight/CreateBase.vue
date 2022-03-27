/* eslint-disable quotes */
<template>
  <v-row>
    <v-col cols="12" class="pt-0">
      <div class="b-steps b-one">
        <div class="b-colum">
          <v-img class="b-add-img" :src="value.file">
            <IconImage />
          </v-img>
        </div>

        <div class="b-colum" style="display: block">
          <ValidationProvider v-slot="{ errors }" rules="required">
            <v-text-field
              v-model.trim="value.content[local].title"
              label="Название"
              color="green"
              outlined
              :error-messages="errors"
            ></v-text-field>
          </ValidationProvider>

          <v-row no-gutters>
            <v-col cols="10">
              <v-text-field
                v-model="value.slug"
                label="Ccылка"
                color="green"
                outlined
                :error-messages="[]"
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="text-right">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    dark
                    color="light-blue lighten-1"
                    v-on="on"
                    v-on:click="generate_url"
                    :disabled="local != 'ru'"
                  >
                    <v-icon>mdi-link-plus</v-icon>
                  </v-btn>
                </template>
                <span>Генерация URL</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-card-title class="pa-0">Описание категории</v-card-title>
        </v-col>
        <v-col>
          <ckeditor
            v-model="value.content[local].desc"
            :editor-url="editorUrl"
            :config="editorConfig"
          ></ckeditor>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ValidationProvider, extend } from 'vee-validate'
import IconImage from '@/components/IconImage.vue'
import { translit } from '@/services/translit'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')

extend('max', {
  message: 'Поле "{_field_}" может содержать максимум {length} знаков',
})

export default {
  components: { IconImage, ValidationProvider },
  props: {
    local: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editorUrl: process.env.VUE_APP_CKEDITOR_URL,
      editorConfig: {
        extraPlugins: ['justify, youtube'],
        allowedContent: true,
        filebrowserImageBrowseUrl: '/laravel-filemanager?type=image',
        filebrowserImageUploadUrl:
          '/laravel-filemanager/upload?type=image&_token=',
        filebrowserBrowseUrl: '/laravel-filemanager?type=Files',
        filebrowserUploadUrl: '/laravel-filemanager/upload?type=Files&_token=',
        contentsCss: '/library/css/editor.css',
        height: '42vh',
        removeButtons: 'Scayt,Anchor,Specialchar,Styles,About,Blockquote',
      },
    }
  },
  watch: {
    // local(newLocal, oldLocal) {
    //   for (let keyValue in this.value.content[oldLocal]) {
    //     if (!this.value.content[newLocal][keyValue]) {
    //       this.value.content[newLocal][keyValue] =
    //         this.value.content[oldLocal][keyValue]
    //     }
    //   }
    // },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    slugErrors() {
      const errors = []
      //   this.$v.value.slug.regexp &&
      //     errors.push(
      //       'Допускаются только цифры, буквы латинского алфавита и тире'
      //     )
      //   if (!this.$v.value.slug.$dirty) return errors
      //   if (this.$v.value.slug.required !== undefined) {
      //     !this.$v.value.slug.required && errors.push('Это поле обязательно!')
      //   }

      return errors
    },
    templateErrors() {
      const errors = []

      //   if (this.$v.value.template && !this.$v.value.template.required) {
      //     errors.push('Это поле обязательно!')
      //   }

      return errors
    },
  },
  methods: {
    validate() {
      this.$v.value.$touch()

      // for (let i = 0; i < this.langs.length; i++) {
      //   let local = this.langs[i].local

      //   if (this.value.status) {
      //     if (
      //       !this.$v.value.content[local].title.required ||
      //       !this.$v.value.content[local].desc.required ||
      //       !this.$v.value.slug.required ||
      //       this.$v.value.slug.regexp
      //     ) {
      //       this.$emit('update:tabSelect', 0)
      //       this.$emit('update:select', this.langs[i].id)
      //       return false
      //     }

      //     if (
      //       !this.$v.value.file.required ||
      //       (this.$v.value.template && !this.$v.value.template.required)
      //     ) {
      //       this.$emit('update:tabSelect', 0)
      //       return false
      //     }
      //   } else if (
      //     !this.$v.value.content.ru.title.required ||
      //     !this.$v.value.slug.required ||
      //     this.$v.value.slug.regexp
      //   ) {
      //     this.$emit('update:tabSelect', 0)
      //     return false
      //   }
      // }
      return true
    },
    // handleInput() {
    //   this.$emit('input', this.content)
    // },
    generate_url() {
      var url = this.value.content[
        process.env.VUE_APP_I18N_LOCALE
      ].title.replace(/[\s]+/gi, '-')
      url = translit(url)
      this.value.slug = url.replace(/[^0-9a-z_\\-]+/gi, '').toLowerCase()
      return url
    },
    requiredErrors() {
      const errors = []
      //   if (!this.$v.value.content[this.local][key].$dirty) return errors
      //   if (this.$v.value.content[this.local][key].required !== undefined) {
      //     !this.$v.value.content[this.local][key].required &&
      //       errors.push('Это поле обязательно!')
      //   }
      return errors
    },
  },
}
</script>
