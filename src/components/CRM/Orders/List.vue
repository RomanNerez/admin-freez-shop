<template>
  <v-card>
    <v-card-title class="card-title__with-sheet">
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
          mdi-cart-outline
        </v-icon>
      </v-sheet>

      <v-row class="pl-7 pr-2">
        <v-col cols="6" class="pt-0 pb-7">
          <v-text-field
            v-model="filter.search"
            append-icon="mdi-magnify"
            label="Заказ, клиент, сумма, адрес"
            single-line
            hide-details
            color="green"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3" class="pt-0 pb-7">
          <v-select
            v-model="filter.status"
            :items="[
              {
                val: -1,
                name: 'Отменен',
              },
              {
                val: 0,
                name: 'Новый',
              },
              {
                val: 1,
                name: 'В работе',
              },
              {
                val: 2,
                name: 'Доставка',
              },
              {
                val: 3,
                name: 'Выполнен',
              },
            ]"
            clearable
            item-text="name"
            item-value="val"
            label="Статус"
            single-line
            hide-details
            color="green"
          ></v-select>
        </v-col>
        <v-col cols="3" class="pt-0 pb-7">
          <v-select
            v-model="filter.pay"
            :items="[
              {
                val: -1,
                name: 'Ошибка',
              },
              {
                val: 0,
                name: 'Не оплачен',
              },
              {
                val: 1,
                name: 'Оплачен',
              },
            ]"
            clearable
            item-text="name"
            item-value="val"
            label="Оплата"
            single-line
            hide-details
            color="green"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      class="orders-table px-6"
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      :footer-props="{
        'items-per-page-options': [5, 10, 15],
      }"
    >
      <template v-slot:item.id="{ item }">
        {{ item.format_data.order_id }}
      </template>

      <template v-slot:item.fullname="{ item }">
        <div class="d-flex client-order py-3 align-center">
          <v-avatar>
            <img :src="item.avatar" />
          </v-avatar>
          <div class="ml-3 client-order__contact">
            <span class="client-order__name">
              {{ item.fullname }}
            </span>
            <a :href="'tel:' + item.phone" class="client-order__phone">{{
              item.phone
            }}</a>
          </div>
          <v-chip
            class="px-3 ml-4"
            v-if="item.count"
            style="
              min-width: max-content;
              cursor: pointer;
              text-align: center;
              display: inline-block;
            "
            v-on:click="filter.search = item.phone"
          >
            {{ item.count }}
          </v-chip>
        </div>
      </template>

      <template v-slot:item.amount="{ item }">
        <b>{{ item.format_data.amount }}</b>
        {{ item.format_data.currency.content.abbrev }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status | statusColor" dark>
          {{ item.status | statusName }}
        </v-chip>
      </template>

      <template v-slot:item.pay="{ item }">
        <span class="orders-table__status" :class="item.pay | payColor">
          <v-icon> mdi-circle </v-icon>
          {{ item.pay | payName }}
        </span>
      </template>

      <template v-slot:item.format_data.datetime.date="{ item }">
        <b>{{ item.format_data.datetime.date }}</b
        ><br />{{ item.format_data.datetime.time }}
      </template>

      <template v-slot:item.edit="{ item }">
        <v-icon class="mr-2" @click="editItem(item.id)"> mdi-pencil </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios'
import { DATA } from '@/router/paths-api'
export default {
  props: ['select', 'formState', 'alert', 'props'],
  data() {
    return {
      filter: {
        search: '',
        status: null,
        pay: null,
      },
      total: 0,
      items: [],
      loading: true,
      options: {},
      headers: [
        {
          text: 'Номер',
          align: 'start',
          value: 'id',
        },
        {
          text: 'Клиент',
          align: 'start',
          sortable: false,
          value: 'fullname',
        },
        {
          text: 'Сумма',
          align: 'start',
          value: 'amount',
        },
        {
          text: 'Статус',
          align: 'start',
          value: 'status',
        },
        {
          text: 'Оплата',
          align: 'start',
          value: 'pay',
        },
        {
          text: 'Дата',
          align: 'end',
          sortable: false,
          value: 'format_data.datetime.date',
        },
        {
          text: '',
          align: 'end',
          sortable: false,
          value: 'edit',
        },
      ],
    }
  },
  watch: {
    options: {
      handler() {
        this.getList()
      },
      deep: true,
    },
    filter: {
      handler() {
        clearTimeout(window._debounce)
        window._debounce = setTimeout(() => {
          if (this.options.page > 1) {
            this.options.page = 1
          } else {
            this.getList()
          }
        }, 1000)
      },
      deep: true,
    },
  },
  filters: {
    statusColor: function (value) {
      switch (value) {
        case -1:
          return '#E53935'
        case 0:
          return 'warning'
        case 1:
          return '#29B6F6'
        case 2:
          return '#0277BD'
        case 3:
          return '#43A047'
      }
    },
    statusName: function (value) {
      switch (value) {
        case -1:
          return 'Отменен'
        case 0:
          return 'Новый'
        case 1:
          return 'В работе'
        case 2:
          return 'Доставка'
        case 3:
          return 'Выполнен'
      }
    },
    payColor: function (value) {
      switch (value) {
        case -1:
          return 'error-pay'
        case 0:
          return 'no-pay'
        case 1:
          return 'true-pay'
      }
    },
    payName: function (value) {
      switch (value) {
        case -1:
          return 'Ошибка'
        case 0:
          return 'Не оплачено'
        case 1:
          return 'Оплачено'
      }
    },
  },
  methods: {
    getList() {
      let sort = 'desc'
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      if (sortDesc.length && !sortDesc[0]) {
        sort = 'asc'
      }

      this.loading = true

      axios
        .get(DATA.CRM.ORDERS.LIST, {
          params: {
            page,
            by: sortBy[0],
            sort: sort,
            per_page: itemsPerPage,
            search: this.filter.search,
            status: this.filter.status,
            pay: this.filter.pay,
          },
        })
        .then((response) => {
          const resp = response.data

          this.total = resp.orders.total
          this.items = resp.orders.data

          if (!this.props) {
            this.$emit('update:props', resp.props)
          }
        })
        .catch(() => {
          this.$emit('update:alert', {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    editItem(id) {
      this.$emit('update:select', id)
      this.$emit('update:formState', true)
    },
  },
}
</script>
