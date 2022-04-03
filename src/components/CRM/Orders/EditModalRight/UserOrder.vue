<template>
  <v-container class="pt-0">
    <validation-observer ref="observer">
      <v-row>
        <v-col>
          <validation-provider v-slot="{ errors }" rules="required" name="Имя">
            <v-text-field
              label="Имя"
              color="green"
              outlined
              class="mb-2"
              v-model="value.fullname"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            v-slot="{ errors }"
            rules="required"
            name="Телефон"
          >
            <v-text-field
              label="Телефон"
              color="green"
              outlined
              class="mb-2"
              v-model="value.phone"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <v-text-field
            label="E-mail"
            color="green"
            outlined
            class="mb-2"
            v-model="value.email"
          ></v-text-field>

          <v-btn
            :loading="pending"
            v-on:click="checkBlackBox"
            color="warning"
            dark
            x-large
            :disabled="!value.phone"
          >
            <v-icon left> mdi-account-check-outline </v-icon>
            Проверка BlackBox
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-for="(box, key) in blackbox" :key="key">
          <v-alert
            v-for="(item, index) in box.tracks"
            :key="item.id"
            border="right"
            colored-border
            type="error"
            elevation="2"
          >
            <div class="alert__content">
              <span class="alert__title">{{
                box.fios[index] ? box.fios[index] : box.fios[0]
              }}</span>
              <span class="alert__subtitle"
                >{{ item.city }} | {{ item.date || 'дата не указана' }}</span
              >
              <span class="alert__text">{{ item.comment }}</span>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>

<script>
import axios from 'axios'
import { required } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'

extend('required', {
  ...required,
  message: 'Поле "{_field_}" должно быть заполнено',
})

export default {
  props: ['value', 'tab-select', 'invalid', 'alert', 'index'],
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      pending: false,
      blackbox: [],
    }
  },
  methods: {
    checkBlackBox() {
      this.pending = true

      axios
        .get('https://blackbox.net.ua/api/', {
          params: {
            data: {
              id: this.value.id,
              params: {
                phonenumber: this.value.phone,
                api_key: process.env.MIX_BLACK_BOX_API,
              },
            },
          },
        })
        .then((response) => {
          const resp = response.data

          if (resp.error) {
            this.$emit('update:alert', {
              type: 'error',
              text:
                // eslint-disable-next-line no-undef
                data.error.code === 104
                  ? 'Закончилась квота на запросы'
                  : 'Неизвестная ошибка, повторите попытку',
            })
          } else {
            if (resp.data) {
              this.blackbox = resp.data
            } else {
              this.$emit('update:alert', {
                type: 'success',
                text: 'Покупатель не найден в черном списке',
              })
            }
          }
        })
        .catch(() => {
          this.$emit('update:alert', {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          })
        })
        .finally(() => {
          setTimeout(() => {
            this.pending = false
          }, 1000)
        })
    },
    validate: function () {
      return this.$refs.observer.validate().then((result) => {
        return {
          result: result,
          index: this.index,
        }
      })
    },
  },
}
</script>
