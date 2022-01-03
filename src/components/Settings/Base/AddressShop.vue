<template>
  <v-col cols="12" sm="5">
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
            mdi-map-marker
          </v-icon>
        </v-sheet>
        <span
          class="mb-6 font-weight-regular user-info__title"
          style="margin-right: -80px"
          >Адрес организации</span
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
          <v-col cols="12" class="py-0" :key="getSelectLocal">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                label="Страна"
                color="green"
                outlined
                hide-details
                dense
                class="mb-6"
                v-model="content[getSelectLocal].addr.country"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>

            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                label="Город"
                color="green"
                outlined
                hide-details
                dense
                class="mb-6"
                v-model="content[getSelectLocal].addr.city"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>

            <validation-provider v-slot="{ errors }" rules="required">
              <v-text-field
                label="Улица"
                color="green"
                outlined
                hide-details
                dense
                class="mb-6"
                v-model="content[getSelectLocal].addr.street"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>
            <v-row>
              <v-col class="py-0" sm="8">
                <validation-provider v-slot="{ errors }" rules="required">
                  <v-text-field
                    label="Дом / офис / квартира"
                    color="green"
                    outlined
                    hide-details
                    dense
                    v-model="content[getSelectLocal].addr.house"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col class="py-0" sm="4">
                <validation-provider v-slot="{ errors }" rules="required">
                  <v-text-field
                    label="Индекс"
                    color="green"
                    outlined
                    hide-details
                    dense
                    v-model="content[getSelectLocal].addr.code"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
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
const { mapGetters: mapGettersSettings } = createNamespacedHelpers('settings')

export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    content: {},
  }),
  beforeMount() {
    this.content = iLang(this.getLangs, {
      addr: {
        city: '',
        code: 0,
        house: '',
        street: '',
        country: '',
      },
    })
  },
  mounted() {
    if (this.getOptions?.content) {
      this.content = this.getOptions.content
    }
  },
  computed: {
    ...mapGettersLang(['getLangs', 'getSelect', 'getSelectLocal']),
    ...mapGettersSettings(['getOptions']),
  },
}
</script>
