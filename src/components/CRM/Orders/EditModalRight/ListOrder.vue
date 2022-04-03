<template>
  <v-container class="pt-0">
    <v-data-table
      class="orders-table orders-table--hide-footer px-6"
      :headers="headers"
      :items="products"
      :hide-default-footer="true"
    >
      <template v-slot:item.title="{ item }">
        <a
          :href="item.url"
          style="color: rgba(0, 0, 0, 0.87)"
          target="_blank"
          >{{ item.title }}</a
        >
      </template>
      <template v-slot:item.quantity="{ item }">
        <b>{{ item.quantity }}</b>
      </template>
      <template v-slot:item.price.value.view="{ item }">
        <b>{{ item.price.value.view }}</b>
        {{ item.price.currency.content.abbrev }}
      </template>
    </v-data-table>
    <v-row class="px-10 pt-2 orders-table-acc">
      <v-col class="pb-0">
        <span
          ><b><small>ИТОГО:</small></b></span
        >
      </v-col>
      <v-col class="text-right pb-0">
        <span
          ><b>{{ this.value.format_data.amount }}</b>
          <small>{{
            this.value.format_data.currency.content.abbrev
          }}</small></span
        >
      </v-col>
    </v-row>
    <v-row class="px-10 orders-table-acc">
      <v-col class="pb-0 pt-1">
        <span
          ><b><small>ВЕС ЗАКАЗА:</small></b></span
        >
      </v-col>
      <v-col class="text-right pb-0 pt-1">
        <span
          ><b>{{ this.value.product.weight.value }}</b>
          <small>{{ this.value.product.weight.unit }}</small></span
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
          text: 'Товар',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        {
          text: 'Количество',
          align: 'end',
          sortable: false,
          value: 'quantity',
        },
        {
          text: 'Сумма',
          align: 'end',
          value: 'price.value.view',
        },
      ],
    }
  },
  computed: {
    products() {
      return this.value.product.items
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
