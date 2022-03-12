<i18n>
  {
    "ru": {
      "name-currency": "Название валюты",
      "short-name-currency": "Сокращенное название"
    }
  }
</i18n>
<template>
  <v-container class="pa-0">
    <v-row>
      <v-col class="pt-0 pr-5">
        <ValidationProvider
          :name="$t('name-currency')"
          v-slot="{ errors }"
          rules="required"
        >
          <v-text-field
            v-model.trim="content[local].name"
            :label="$t('name-currency')"
            color="green"
            outlined
            :error-messages="errors"
          ></v-text-field>
        </ValidationProvider>
      </v-col>
      <v-col class="pt-0 pl-5">
        <ValidationProvider
          :name="$t('short-name-currency')"
          v-slot="{ errors }"
          rules="required"
        >
          <v-text-field
            v-model.trim="content[local].abbrev"
            :label="$t('short-name-currency')"
            color="green"
            outlined
            :error-messages="errors"
          ></v-text-field>
        </ValidationProvider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ValidationProvider } from 'vee-validate'
import { iLang } from '@/interfaces/iLang'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersCurrency } =
  createNamespacedHelpers('settings/currency')

export default {
  components: { ValidationProvider },
  props: {
    local: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      content: {},
    }
  },
  watch: {
    local(newLocal, oldLocal) {
      for (let keyValue in this.content[oldLocal]) {
        if (!this.content[newLocal][keyValue]) {
          this.content[newLocal][keyValue] = this.content[oldLocal][keyValue]
        }
      }
    },
    content: {
      deep: true,
      handler(a) {
        this.$emit('input', a)
      },
    },
  },
  computed: {
    ...mapGettersLang(['getLangs']),
    ...mapGettersCurrency(['getEditCurrency']),
  },
  beforeMount() {
    if (this.getEditCurrency) {
      this.content = this.getEditCurrency.content
      return
    }
    this.content = iLang(this.getLangs, {
      name: '',
      abbrev: '',
    })
  },
}
</script>
