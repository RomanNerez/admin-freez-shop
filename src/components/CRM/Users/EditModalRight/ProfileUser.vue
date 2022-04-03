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
            name="E-mail"
            :custom-messages="{
              regex: 'Поле должно содержать корректную запись типа E-mal',
            }"
            :rules="{
              required: true,
              regex: /^[\w-\.\d*]+@[\w\d]+(\.\w{2,4})$/,
            }"
          >
            <v-text-field
              label="E-mail"
              color="green"
              outlined
              class="mb-2"
              v-model="value.email"
              :error-messages="errors"
            ></v-text-field>
          </validation-provider>

          <v-text-field
            label="Телефон"
            color="green"
            outlined
            class="mb-2"
            v-model="value.phone"
          ></v-text-field>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>

<script>
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'

extend('required', {
  ...required,
  message: 'Поле "{_field_}" должно быть заполнено',
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
      pending: false,
      blackbox: [],
    }
  },
  methods: {
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
