<template>
  <v-container class="pt-0">
    <v-row>
      <v-col cols="6">
        <v-text-field
          label="Постоянная скидка, %"
          type="number"
          color="green"
          outlined
          class="mb-2"
          v-model.number="value.sale"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-checkbox
          class="ma-0"
          v-model="value.wholesale"
          label="Оптовый покупатель"
          color="success"
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Ключ API Новая почта"
          color="green"
          outlined
          class="mb-2"
          v-model="value.np_account"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['value', 'tab-select', 'invalid', 'alert', 'index'],
  methods: {
    validate: function () {
      return {
        result: true,
        index: this.index,
      }
    },
  },
}
</script>
