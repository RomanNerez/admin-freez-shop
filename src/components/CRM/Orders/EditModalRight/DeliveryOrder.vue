<template>
  <v-container
    class="pt-0 admin-delivery"
    :class="{ 'complete-ttn': value.ttn }"
  >
    <v-row>
      <v-col class="pt-0 pr-10" cols="7">
        <v-card-title class="pa-0 pb-2">Способ доставки</v-card-title>

        <v-radio-group class="mt-0" v-model="deliveryType" mandatory>
          <v-radio
            v-for="(item, index) in delivery"
            :key="index"
            :label="item.content.name"
            :value="index"
            color="green"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="pt-0" cols="5">
        <v-card-title class="pa-0 pb-2">Способ оплаты</v-card-title>

        <v-radio-group
          class="mt-0"
          v-if="deliveryType !== null"
          v-model="value.payment"
          mandatory
        >
          <v-radio
            v-for="item in payment"
            :key="item.key"
            :label="item.name"
            :value="item.key"
            :disabled="checkDelivery.payment.indexOf(item.key) === -1"
            color="green"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="deliveryType !== null && input.delivery">
        <v-row v-for="key in checkDelivery.inputs" :key="key + deliveryType">
          <v-col :cols="key === 'address' && deliveryType === 1 ? 8 : 12">
            <component
              :is="getDeliveryInput(key)"
              v-model.trim="input.delivery[key]"
              :alt-value.sync="inputData.delivery[key]"
              :holder="getDeliveryInputHolder(key)"
              :key="key + deliveryType"
              :target="key"
              :prop="getDeliveryPropData(key)"
              :api="checkDelivery.api"
              :disabled="!checkEnabledDeliveryInput(key)"
              :default-value="input.delivery[key]"
            />
          </v-col>
          <v-col v-if="key === 'address' && deliveryType === 1" cols="4">
            <v-text-field
              label="Дом/квартира/офис"
              color="green"
              outlined
              class="mb-0"
              v-model.number="prop.build"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-btn
          v-if="checkGenerateEN"
          color="warning"
          dark
          x-large
          :loading="pending && !sender.ref"
          v-on:click="getSender"
          class="mt-4"
          :class="{
            disabled: !checkDeliveryData() || pending || sender.ref,
          }"
        >
          <v-icon left> mdi-file-download-outline </v-icon>
          Сформировать ЭН
        </v-btn>

        <template v-if="sender.ref && !value.ttn">
          <v-row>
            <v-col cols="12" class="pl-0 pb-0 pt-8">
              <v-card-title>Данные по отправке</v-card-title>
            </v-col>

            <v-col cols="8">
              <with-search
                v-model.trim="sender.locality.query"
                :alt-value.sync="sender.locality.data"
                holder="Населенный пункт"
                key="locality"
                target="locality"
                :prop="null"
                api="np"
                :default-value="sender.locality.query"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model.trim="payer"
                :items="[
                  {
                    val: 'Sender',
                    name: 'Отправитель',
                  },
                  {
                    val: 'Recipient',
                    name: 'Получатель',
                  },
                ]"
                item-value="val"
                item-text="name"
                color="green"
                label="Плательщик"
                outlined
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="8">
              <with-search
                v-model.trim="sender.branch.query"
                :alt-value.sync="sender.branch.data"
                holder="Отделение"
                key="branch"
                target="branch"
                :prop="sender.locality.data"
                api="np"
                :default-value="sender.branch.query"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Кол-во мест груза"
                type="number"
                color="green"
                outlined
                class="mb-2"
                v-model="countPlace"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-2">
              <v-textarea
                label="Описание груза"
                color="green"
                outlined
                v-model="descDelivery"
                hide-details
              ></v-textarea>
            </v-col>
            <v-col cols="12" class="pt-2">
              <v-textarea
                label="Дополнительная информация"
                color="green"
                outlined
                :counter="100"
                v-model="addInfo"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-btn
                color="warning"
                dark
                x-large
                :loading="pending"
                v-on:click="generateEn"
                :class="{
                  disabled: !checkApplyEn || pending,
                }"
              >
                <v-icon left> mdi-check-all </v-icon>
                Подтвердить данные
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
    <div class="complete-ttn-wrap" v-if="value.ttn">
      <div class="complete-ttn-wrap__title-wrap">
        <span class="complete-ttn-wrap__title"> Сформирована ТТН </span>
        <span class="complete-ttn-wrap__subtitle">
          данные о доставке не подлежат редактированию
        </span>
      </div>
      <div class="complete-ttn-wrap__document">
        <a :href="linkTtn" target="_blank">{{ value.ttn.id }}</a>
        <button
          type="button"
          :disabled="deleteTtnPending"
          v-on:click="
            $root.confirmAction($event, {
              type: 'delete_ttn',
              action: deleteTtn,
            })
          "
        >
          {{ deleteTtnPending ? 'обработка...' : 'удалить' }}
        </button>
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import BaseInput from './DeliveryInputs/BaseInput'
import WithSearch from './DeliveryInputs/WithSearch'
import { DATA } from '@/router/paths-api'

export default {
  props: ['value', 'tab-select', 'invalid', 'alert', 'options'],
  components: { BaseInput, WithSearch },
  data() {
    return {
      inputData: {},
      input: {},
      pending: false,
      deleteTtnPending: false,
      payer: 'Sender',
      countPlace: 1,
      descDelivery: 'магниты',
      addInfo: '',
      sortCountry: ['UA', 'RU', 'BY', 'KZ'],
      sender: {
        ref: null,
        contacts: null,
        locality: {
          query: 'г. Запорожье, Запорожская область',
          data: null,
        },
        branch: {
          query:
            'Отделение №9 (до 30 кг на одно место): просп. Металлургов, 19',
          data: null,
        },
      },
      prop: {
        build: '',
      },
      deliveryType: null,
    }
  },
  mounted() {
    if (this.value.delivery) {
      this.deliveryType = this.value.delivery.type
    }

    this.addInfo = this.value.product.items
      .reduce((acc, current) => {
        acc += current.title + ' x ' + current.quantity + ' шт.' + '\n'
        return acc
      }, '')
      .trim()
  },
  watch: {
    deliveryType: function () {
      if (this.checkDelivery.inputs) {
        this.$set(
          this.input,
          'delivery',
          this.checkDelivery.inputs.reduce(function (inputs, key) {
            inputs[key] = ''
            return inputs
          }, {})
        )

        this.$set(this.inputData, 'delivery', { ...this.input.delivery })
      } else if (this.input.delivery) {
        this.$delete(this.input, 'delivery')
        this.inputData.delivery = null
      }

      if (this.checkDelivery.inputs) {
        this.setDeliveryMethod()
      }

      if (this.checkDelivery.payment.indexOf(this.value.payment) === -1) {
        this.value.payment = this.payment.filter(
          (item) => this.checkDelivery.payment.indexOf(item.key) !== -1
        )[0].key
      }
    },
  },
  computed: {
    delivery: function () {
      return this.options.delivery
    },
    payment: function () {
      return this.options.payment
    },
    country: function () {
      return Object.keys(this.options.country)
        .map((key) => {
          return {
            code: key,
            val: this.options.country[key],
          }
        })
        .sort((a, b) => {
          const checkA = this.sortCountry.indexOf(a.code),
            checkB = this.sortCountry.indexOf(b.code)

          return checkA >= 0 || checkB >= 0
            ? checkA - checkB - (this.sortCountry.length + 1)
            : 0
        })
    },
    checkDelivery: function () {
      return this.delivery[this.deliveryType]
    },
    checkPayment: function () {
      return this.payment.find((item) => item.key === this.value.payment)
    },
    user: function () {
      return this.$store.getters.userData
    },
    checkGenerateEN: function () {
      const typeCheck = [0, 1].indexOf(this.deliveryType) !== -1
      return this.user.np_account && typeCheck
    },
    paymentMethod: function () {
      return this.checkPayment.key === 'cashless' ? 'NonCash' : 'Cash'
    },
    serviceType: function () {
      switch (this.deliveryType) {
        case 0:
          return 'WarehouseWarehouse'
        case 1:
          return 'WarehouseDoors'
        default:
          return null
      }
    },
    checkApplyEn() {
      return (
        this.sender.locality.data &&
        this.sender.branch.data &&
        this.payer &&
        this.countPlace &&
        this.descDelivery
      )
    },
    linkTtn() {
      return (
        'https://my.novaposhta.ua/orders/printDocument/orders/' +
        this.value.ttn.id +
        '/type/pdf/apiKey/' +
        this.user.np_account
      )
    },
  },
  methods: {
    validate() {
      this.value.delivery = { ...this.input.delivery }
      this.value.delivery.type = this.deliveryType

      return {
        result: true,
        index: this.tabSelect,
      }
    },
    setDeliveryMethod: function () {
      if (this.value.delivery) {
        if (
          typeof this.input.delivery.address !== undefined &&
          this.value.delivery.address
        ) {
          this.input.delivery.address = this.value.delivery.address
        }
        if (
          typeof this.input.delivery.branch !== undefined &&
          this.value.delivery.branch
        ) {
          this.input.delivery.branch = this.value.delivery.branch
        }
        if (
          this.input.delivery.country !== undefined &&
          this.value.delivery.country
        ) {
          this.input.delivery.country = this.value.delivery.country
        }
        if (
          this.input.delivery.locality !== undefined &&
          this.value.delivery.locality
        ) {
          this.input.delivery.locality = this.value.delivery.locality
        }
        if (
          this.input.delivery.code !== undefined &&
          this.value.delivery.code
        ) {
          this.input.delivery.code = this.value.delivery.code
        }
      }
    },
    checkDeliveryData: function () {
      for (let key in this.inputData.delivery) {
        const item = this.inputData.delivery[key]

        if (!item || !item.code) {
          return false
        }
      }
      if (this.deliveryType === 1 && !this.prop.build) {
        return false
      }
      return true
    },
    getDeliveryInput: function (key) {
      switch (key) {
        case 'country':
          return 'WithSearch'
        case 'locality':
          if (
            !this.input.delivery.country ||
            this.inputData.delivery.country.code === 'UA'
          ) {
            return 'WithSearch'
          } else {
            return 'BaseInput'
          }
        case 'branch':
          return this.checkDelivery.api ? 'WithSearch' : 'BaseInput'
        case 'address':
          return this.checkDelivery.api && this.inputData.delivery.locality.code
            ? 'WithSearch'
            : 'BaseInput'
        default:
          return 'BaseInput'
      }
    },
    getDeliveryPropData: function (key) {
      switch (key) {
        case 'country':
          return this.country
        case 'branch':
        case 'address':
          return this.inputData.delivery.locality
        default:
          return null
      }
    },
    checkEnabledDeliveryInput: function (key) {
      switch (key) {
        case 'locality':
          return (
            this.inputData.delivery.country === undefined ||
            this.inputData.delivery.country.code
          )
        case 'branch':
        case 'address':
          return (
            this.inputData.delivery.locality === undefined ||
            this.inputData.delivery.locality.code
          )
        default:
          return true
      }
    },
    getDeliveryInputHolder(key) {
      let value
      switch (key) {
        case 'country':
          value = 'Страна'
          break
        case 'region':
          value = 'Область'
          break
        case 'locality':
          value = 'Населенный пункт (город, поселок, село)'
          break
        case 'address':
          value = 'Адрес (улица, дом, квартира)'
          break
        case 'code':
          value = 'Индекс'
          break
        case 'branch':
          value = 'Отделение'
          break
      }
      return value
    },
    getSender: function () {
      this.pending = true

      axios
        .get(DATA.CRM.ORDERS.SENDER)
        .then((response) => {
          const data = response.data

          if (data.success) {
            this.sender.ref = data.sender
            this.sender.contacts = data.contacts
          } else {
            this.$emit('update:alert', {
              type: 'error',
              text: data.error || 'Неизвестная ошибка, повторите попытку',
            })
          }
        })
        .catch(() => {
          this.$emit('update:alert', {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          })
        })
        .finally(() => {
          this.pending = false
        })
    },
    generateEn: function () {
      const clientName = this.value.fullname.split(' '),
        weight = this.value.product.weight.origin / 1000

      if (!clientName[0] || !clientName[1]) {
        this.$emit('update:alert', {
          type: 'error',
          text: 'Необходимо указать <b>Имя</b> и <b>Фамилию</b> клиента',
        })
        return
      }

      if (this.deliveryType === 1 && !clientName[2]) {
        this.$emit('update:alert', {
          type: 'error',
          text: 'Для выбранного способа доставки необходимо указать <b>Отчество</b> клиента',
        })
        return
      }

      if (this.addInfo.length > 100) {
        this.$emit('update:alert', {
          type: 'error',
          text: 'Поле <b>"Дополнительная информация"</b> может содержать максимум <b>100 символов</b>',
        })
        return
      }

      let recipient = {
        phone: this.value.phone.replace(/[^\d]/g, ''),
        firstname: clientName[0],
        lastname: clientName[1],
      }

      switch (this.deliveryType) {
        case 0:
          recipient.locality = this.inputData.delivery.locality.code
          recipient.target = this.inputData.delivery.branch.code
          break
        case 1:
          recipient.locality = this.inputData.delivery.locality
          recipient.middlename = clientName[2]
          recipient.target = {
            street: this.inputData.delivery.address,
            build: this.prop.build,
          }
          break
      }

      this.pending = true

      axios
        .post(DATA.CRM.ORDERS.GENERATE_EN, {
          data: {
            order: this.value.id,
            payer: this.payer,
            payment: this.paymentMethod,
            is_pod: this.checkPayment.key === 'pod',
            service_type: this.serviceType,
            count_place: this.countPlace,
            desc_delivery: this.descDelivery,
            add_info: this.addInfo,
            weight: weight >= 0.1 ? weight : 0.1,
            amount: Math.round(this.value.amount * 100) / 100,
            recipient: recipient,
            sender: {
              ref: this.sender.ref,
              locality: this.sender.locality.data.code,
              branch: this.sender.branch.data.code,
              contacts: this.sender.contacts,
            },
          },
        })
        .then((response) => {
          const data = response.data

          if (data.success) {
            this.value.ttn = data.ttn
            this.sender.ref = null
            this.sender.contacts = null

            this.descDelivery = ''
          } else {
            this.$emit('update:alert', {
              type: 'error',
              text: data.error || 'Неизвестная ошибка, повторите попытку',
            })
          }
        })
        .catch(() => {
          this.$emit('update:alert', {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          })
        })
        .finally(() => {
          this.pending = false
        })
    },
    deleteTtn: function () {
      this.deleteTtnPending = true

      axios
        .post(DATA.CRM.ORDERS.DELETE_TTN, {
          order: this.value.id,
        })
        .then((response) => {
          const data = response.data

          if (data.success) {
            this.value.ttn = null
          } else {
            this.$emit('update:alert', {
              type: 'error',
              text: data.error || 'Неизвестная ошибка, повторите попытку',
            })
          }
        })
        .catch(() => {
          this.$emit('update:alert', {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          })
        })
        .finally(() => {
          this.deleteTtnPending = false
        })
    },
  },
}
</script>
