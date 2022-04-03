<template>
  <v-container class="pt-0">
    <validation-observer ref="observer">
      <v-row>
        <v-col>
          <validation-provider
            v-slot="{ errors }"
            name="Пароль"
            :custom-messages="{
              regex:
                'Поле должно содержать цифры и латинские буквы (хотя бы одна заглавная)',
            }"
            :rules="{
              min: 6,
              regex: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*/,
            }"
          >
            <v-text-field
              label="Пароль"
              color="green"
              outlined
              class="mb-2"
              v-model="password"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            v-slot="{ errors }"
            name="Повторите пароль"
            :rules="{
              min: 6,
              regex: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*/,
            }"
          >
            <v-text-field
              label="Повторите пароль"
              color="green"
              outlined
              class="mb-2"
              v-model="confirmation"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <v-btn v-on:click="generate" color="warning" dark x-large>
            <v-icon left> mdi-account-check-outline </v-icon>
            Сгенерировать пароль
          </v-btn>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>

<script>
import { required, min, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'

extend('required', {
  ...required,
  message: 'Поле "{_field_}" должно быть заполнено',
})

extend('min', {
  ...min,
  message: 'Поле "{_field_}" должно содержать минимум 6 символов',
})

extend('regex', {
  ...regex,
})

export default {
  props: ['value', 'tab-select', 'invalid', 'alert', 'index'],
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      password: '',
      confirmation: '',
    }
  },
  methods: {
    generate() {
      const pass = this.generatePassword()

      this.password = pass
      this.confirmation = pass
    },
    validate: function () {
      return this.$refs.observer.validate().then((result) => {
        if (this.password === this.confirmation) {
          this.value.password = this.password
          return {
            result: result,
            index: this.index,
          }
        }

        return {
          result: false,
          index: this.index,
          alert: 'Пароли должны совпадать',
        }
      })
    },
    generatePassword() {
      const length = 8,
        charset =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

      let retVal = ''

      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
      }
      return retVal
    },
  },
}
</script>
