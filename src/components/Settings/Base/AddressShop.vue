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
        >
          Адрес организации
        </span>
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
                v-model="content[getSelectLocal].country"
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
                v-model="content[getSelectLocal].city"
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
                v-model="content[getSelectLocal].street"
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
                    v-model="content[getSelectLocal].house"
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
                    v-model="content[getSelectLocal].code"
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
const { mapGetters: mapGettersSettings } =
  createNamespacedHelpers('settings/options')

export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    content: {},
  }),
  watch: {
    getSelectLocal(a, b) {
      for (let key in this.content[b]) {
        const item = this.content[a][key]

        if (!item && this.content[b]) {
          this.content[a][key] = this.content[b][key]
        }
      }
    },
  },
  beforeMount() {
    this.content = iLang(this.getLangs, {
      city: '',
      code: 0,
      house: '',
      street: '',
      country: '',
    })
  },
  computed: {
    ...mapGettersLang(['getLangs', 'getSelectLocal']),
    ...mapGettersSettings(['getOptions']),
  },
  mounted() {
    this.__initData()
  },
  methods: {
    __initData() {
      this.getLangs.forEach(({ local }) => {
        this.content[local] =
          this.getOptions?.content?.[local]?.addr ?? this.content[local]
      })
    },
  },
}
</script>
