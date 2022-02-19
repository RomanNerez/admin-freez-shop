<template>
  <v-col cols="12" sm="12">
    <v-card>
      <v-card-title class="py-0 table-header__btn">
        <v-sheet
          style="
            position: relative;
            top: -24px;
            transition: 0.3s ease;
            z-index: 1;
          "
          class="pa-7 text-center green rounded b-user-info__square"
          elevation="5"
        >
          <v-icon class="theme--dark" style="font-size: 32px">
            mdi-truck-check-outline
          </v-icon>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="addDelivery"> mdi-plus </v-icon>
            </template>
            <span>Вариант доставки</span>
          </v-tooltip>
        </v-sheet>
        <span class="mb-6 font-weight-regular user-info__title"
          >Способы доставки</span
        >
      </v-card-title>

      <v-container
        class="px-8 pt-4 pb-5 content-page options-wrap"
        style="height: 550px"
      >
        <form action="#">
          <v-row
            class="delivery-item"
            v-for="(_item, index) in delivery"
            :key="index"
          >
            <v-col sm="11" class="py-0">
              <v-row>
                <v-col sm="8">
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      v-model="content[getSelectLocal].delivery[index].name"
                      label="Название"
                      color="green"
                      outlined
                      dense
                      hide-details
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col sm="4" class="pr-0">
                  <v-select
                    v-model="_item.api"
                    :items="SELECT.API"
                    clearable
                    item-value="val"
                    item-text="name"
                    label="Интеграция"
                    color="green"
                    outlined
                    dense
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="4">
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      v-model="_item.price.rate"
                      label="Ставка по доставке, грн"
                      color="green"
                      outlined
                      dense
                      hide-details
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-text-field
                      class="mt-6"
                      v-model="_item.price.sum"
                      label="Стоимость за кг, грн"
                      color="green"
                      outlined
                      dense
                      hide-details
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col sm="4">
                  <v-select
                    v-model="_item.inputs"
                    :items="SELECT.FORM_INPUT"
                    clearable
                    multiple
                    chips
                    item-value="val"
                    item-text="name"
                    label="Поля формы"
                    color="green"
                    outlined
                    hide-details
                  />
                </v-col>

                <v-col sm="4" class="pr-0">
                  <validation-provider v-slot="{ errors }" rules="required">
                    <v-select
                      v-model="_item.payment"
                      :items="SELECT.PAYMENTS"
                      clearable
                      multiple
                      chips
                      item-value="val"
                      item-text="name"
                      label="Способы оплаты"
                      color="green"
                      outlined
                      hide-details
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-col>
            <v-col sm="1" class="pr-0 text-right">
              <v-btn
                fab
                dark
                small
                color="red lighten-1 is-disabled"
                v-on:click="rmDelivery(index)"
              >
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </v-container>
    </v-card>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ValidationProvider } from 'vee-validate'
import { SELECT } from '@/constants/delivery-select'
import { iLang } from '@/interfaces/iLang'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersSettings } =
  createNamespacedHelpers('settings/options')

export default {
  name: 'Delivery',
  components: { ValidationProvider },
  data: () => ({
    SELECT,
    delivery: [],
    content: {},
  }),
  computed: {
    ...mapGettersLang(['getLangs', 'getSelect', 'getSelectLocal']),
    ...mapGettersSettings(['getOptions']),
  },
  beforeMount() {
    this.content = iLang(this.getLangs, {
      delivery: [],
    })
  },
  mounted() {
    this.__initData()
  },
  methods: {
    __initData() {
      this.delivery = this.getOptions?.delivery ?? []

      const content = this.getOptions?.content
      if (!content) return
      this.getLangs.forEach(({ local }) => {
        if (!content[local]) return

        this.content[local].delivery =
          content[local]?.delivery ?? this.content[local].delivery
      })
    },
    addDelivery: function () {
      this.delivery.push({
        inputs: null,
        payment: null,
        api: null,
        price: {
          rate: 0,
          sum: 0,
        },
      })

      this.getLangs.forEach(({ local }) => {
        this.content[local].delivery.push({
          name: '',
        })
      })
    },
    rmDelivery: function (index) {
      this.delivery.splice(index, 1)

      this.getLangs.forEach(({ local }) => {
        this.content[local].delivery.splice(index, 1)
      })
    },
  },
}
</script>
