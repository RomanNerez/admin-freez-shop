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
              <ValidationProvider v-slot="{ errors }" rules="required">
                <v-text-field
                  v-model="value.slug"
                  label="Ccылка"
                  color="green"
                  outlined
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
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
import { ValidationProvider } from 'vee-validate'
import IconImage from '@/components/IconImage.vue'
import { translit } from '@/services/translit'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')

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
  computed: {
    ...mapGettersLang(['getLangs']),
  },
  methods: {
    generate_url() {
      var url = this.value.content[
        process.env.VUE_APP_I18N_LOCALE
      ].title.replace(/[\s]+/gi, '-')
      url = translit(url)
      this.value.slug = url.replace(/[^0-9a-z_\\-]+/gi, '').toLowerCase()
      return url
    },
  },
}
</script>
