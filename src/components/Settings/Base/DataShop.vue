<template>
  <v-col sm="8">
    <v-card>
      <v-card-title class="py-0">
        <v-sheet
          style="
            position: relative;
            top: -24px;
            transition: 0.3s ease;
            z-index: 1;
          "
          class="pa-7 text-center green rounded"
          elevation="5"
        >
          <v-icon class="theme--dark" style="font-size: 32px">
            mdi-message-cog-outline
          </v-icon>
        </v-sheet>
        <span
          class="mb-6 font-weight-regular user-info__title"
          style="margin-right: -80px"
          >Данные магазина</span
        >

        <v-select
          style="max-width: 80px"
          v-model="getSelect"
          :items="getLangs"
          item-value="id"
          item-text="local"
          label="Язык"
          color="green"
          solo
          dense
        ></v-select>
      </v-card-title>

      <v-container class="pa-8 pt-4 content-page">
        <v-row>
          <v-col sm="10" class="pr-10 py-0">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                label="Заголовок"
                color="green"
                outlined
                dense
                hide-details
                class="mb-6"
                v-model="content[getSelectLocal].title"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>

            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                label="Короткое описание"
                color="green"
                outlined
                dense
                hide-details
                class="mb-6"
                v-model="content[getSelectLocal].short_desc"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>

            <validation-provider v-slot="{ errors }" rules="required">
              <v-textarea
                height="132px"
                no-resize
                label="Основное описание"
                color="green"
                outlined
                hide-details
                class="mb-6"
                v-model="content[getSelectLocal].desc"
                :error-messages="errors"
              ></v-textarea>
            </validation-provider>

            <validation-provider v-slot="{ errors }" rules="required">
              <v-textarea
                height="132px"
                no-resize
                label="График работы"
                color="green"
                outlined
                hide-details
                v-model="content[getSelectLocal].schedule"
                :error-messages="errors"
              ></v-textarea>
            </validation-provider>
          </v-col>
          <v-col cols="12" sm="2" class="py-0">
            <v-row class="mb-6">
              <span class="option-store-logo">Цветной режим</span>
              <v-col cols="12" class="media-box my-0" style="height: 104px">
                <v-hover>
                  <template v-slot:default>
                    <v-btn
                      class="ma-0 pa-0 overflow-hidden set-media-item"
                      elevation="4"
                      color="#FAFAFA"
                      v-on:click="setMedia(data, 'logo_color', -1)"
                    >
                      <template v-if="logo_color">
                        <v-img :src="logo_color"></v-img>
                      </template>
                      <template v-else>
                        <v-sheet
                          class="d-flex align-center justify-center"
                          color="#FAFAFA"
                        >
                          <v-icon size="50" color="#BDBDBD">
                            mdi-image-size-select-large
                          </v-icon>
                        </v-sheet>
                      </template>
                    </v-btn>
                  </template>
                </v-hover>
              </v-col>
            </v-row>

            <v-row class="mb-6">
              <span class="option-store-logo">Светлый режим</span>
              <v-col cols="12" class="media-box my-0" style="height: 104px">
                <v-hover>
                  <template v-slot:default>
                    <v-btn
                      class="ma-0 pa-0 overflow-hidden set-media-item"
                      elevation="4"
                      color="#FAFAFA"
                      v-on:click="setMedia(data, 'logo_light', -1)"
                    >
                      <template v-if="logo_light">
                        <v-img :src="logo_light"></v-img>
                      </template>
                      <template v-else>
                        <v-sheet
                          class="d-flex align-center justify-center"
                          color="#FAFAFA"
                        >
                          <v-icon size="50" color="#BDBDBD">
                            mdi-image-size-select-large
                          </v-icon>
                        </v-sheet>
                      </template>
                    </v-btn>
                  </template>
                </v-hover>
              </v-col>
            </v-row>

            <v-row>
              <span class="option-store-logo">Темный режим</span>
              <v-col cols="12" class="media-box my-0" style="height: 104px">
                <v-hover>
                  <template v-slot:default>
                    <v-btn
                      class="ma-0 pa-0 overflow-hidden set-media-item"
                      elevation="4"
                      color="#FAFAFA"
                      v-on:click="setMedia(data, 'logo_dark', -1)"
                    >
                      <template v-if="logo_dark">
                        <v-img :src="logo_dark"></v-img>
                      </template>
                      <template v-else>
                        <v-sheet
                          class="d-flex align-center justify-center"
                          color="#FAFAFA"
                        >
                          <v-icon size="50" color="#BDBDBD">
                            mdi-image-size-select-large
                          </v-icon>
                        </v-sheet>
                      </template>
                    </v-btn>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ValidationProvider } from 'vee-validate'
import { iLang } from '@/interfaces/iLang'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')

export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    content: {},
    logo_dark: null,
    logo_light: null,
    logo_color: null,
  }),
  beforeMount() {
    this.content = iLang(this.getLangs, {
      title: '',
      short_desc: '',
      desc: '',
      schedule: '',
    })
  },
  computed: {
    ...mapGettersLang(['getLangs', 'getSelect', 'getSelectLocal']),
  },
}
</script>
