<template>
  <v-col cols="12" sm="4">
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
            mdi-contacts-outline
          </v-icon>
        </v-sheet>
        <span class="mb-6 font-weight-regular user-info__title">Контакты</span>
      </v-card-title>

      <v-container
        class="pa-8 pt-4 content-page options-wrap"
        style="height: 464px"
      >
        <v-row>
          <v-col class="py-0">
            <validation-provider v-slot="{ errors }" rules="required">
              <v-textarea
                label="Номера телефонов"
                color="green"
                outlined
                hide-details
                class="mb-8"
                rows="8"
                v-model="phones"
                :error-messages="errors"
              ></v-textarea>
            </validation-provider>

            <validation-provider v-slot="{ errors }" rules="required">
              <v-textarea
                label="E-mail адреса"
                color="green"
                outlined
                hide-details
                rows="5"
                v-model="emails"
                :error-messages="errors"
              ></v-textarea>
            </validation-provider>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ValidationProvider } from 'vee-validate'

const { mapGetters } = createNamespacedHelpers('settings')

export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    phones: '',
    emails: '',
  }),
  mounted() {
    this.__initData(['phones', 'emails'])
  },
  computed: {
    ...mapGetters(['getOptions']),
  },
  methods: {
    __initData(arrKey = []) {
      arrKey.forEach((key) => {
        if (this.getOptions[key]) {
          this[key] = this.getOptions[key]
        }
      })
    },
  },
}
</script>
