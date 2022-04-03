<template>
  <v-container class="pt-0">
    <v-data-table
      class="orders-table orders-table--hide-footer px-6"
      :headers="headers"
      :items="params"
      :hide-default-footer="true"
    >
    </v-data-table>
    <v-row class="px-10 pt-2 orders-table-acc" v-if="value.amount">
      <v-col class="pb-0">
        <span
          ><b><small>К ОПЛАТЕ:</small></b></span
        >
      </v-col>
      <v-col class="text-right pb-0">
        <span
          ><b>{{ value.format_data.amount }}</b>
          <small>{{ value.format_data.currency.content.abbrev }}</small></span
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'OrderList',
  props: ['value', 'tab-select', 'invalid'],
  data() {
    return {
      headers: [
        {
          text: 'Параметр',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Значение',
          align: 'start',
          sortable: false,
          value: 'value',
        },
      ],
    }
  },
  computed: {
    params() {
      return [
        ...this.value.params,
        {
          name: 'Доп. инфо.',
          value: this.value.attachment || '---',
        },
        {
          name: 'Ком. клиента',
          value: this.value.note || '---',
        },
        {
          name: 'Кол-во',
          value: this.value.quantity,
        },
      ]
    },
  },
  methods: {
    validate() {
      return {
        result: true,
        index: this.tabSelect,
      }
    },
  },
}
</script>
