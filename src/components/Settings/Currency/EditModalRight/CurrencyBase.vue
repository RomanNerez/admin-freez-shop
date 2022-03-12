<i18n>
  {
    "ru": {
      "code-currency": "Код валюты",
      "symbol-currency": "Символ валюты"
    }
  }
</i18n>
<template>
  <v-container class="pa-0">
    <v-row>
      <v-col class="pt-0 pr-5">
        <ValidationProvider
          :name="$t('code-currency')"
          v-slot="{ errors }"
          rules="required|max:5"
        >
          <v-text-field
            :label="$t('code-currency')"
            color="green"
            :counter="5"
            outlined
            :error-messages="errors"
            :value="value.code"
            @input="changeValue($event, 'code')"
          ></v-text-field>
        </ValidationProvider>
      </v-col>
      <v-col class="pt-0 pl-5">
        <ValidationProvider
          :name="$t('symbol-currency')"
          v-slot="{ errors }"
          rules="required|max:3"
        >
          <v-text-field
            :label="$t('symbol-currency')"
            color="green"
            :counter="3"
            outlined
            :error-messages="errors"
            :value="value.symbol"
            @input="changeValue($event, 'symbol')"
          ></v-text-field>
        </ValidationProvider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ValidationProvider, extend } from 'vee-validate'
import { max } from '@/plugins/vee-validate'

extend('max', {
  message: 'Поле "{_field_}" может содержать максимум {length} знаков',
  ...max,
})

export default {
  components: { ValidationProvider },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeValue(value, key) {
      const data = {
        ...this.value,
        [key]: value,
      }
      this.$emit('input', data)
    },
  },
}
</script>
