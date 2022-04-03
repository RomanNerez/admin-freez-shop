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
          mdi-account-edit-outline
        </v-icon>
      </v-sheet>

      <v-row class="pl-7 pr-2">
        <v-col cols="7" class="pt-0 pb-7">
          <v-text-field
            v-model="filter.search"
            append-icon="mdi-magnify"
            label="Имя, E-mail, телефон"
            single-line
            hide-details
            color="green"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="5" class="pt-0 pb-7">
          <v-select
            v-model="filter.role"
            :items="[
              {
                val: 'user',
                name: 'Клиент',
              },
              {
                val: 'manager',
                name: 'Менеджер',
              },
              {
                val: 'admin',
                name: 'Администратор',
              },
            ]"
            clearable
            item-text="name"
            item-value="val"
            label="Роль"
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
        {{ item.id }}
      </template>

      <template v-slot:item.fullname="{ item }">
        <div class="d-flex client-order py-3">
          <v-avatar>
            <img :src="item.avatar" />
          </v-avatar>
          <div class="ml-3 client-order__contact">
            <span class="client-order__name">
              {{ item.fullname }}
            </span>
            <template v-if="item.phone">
              <a :href="'tel:' + item.phone" class="client-order__phone">{{
                item.phone
              }}</a>
            </template>
            <template v-else>
              <a href="#0" class="client-order__phone" v-on:click.prevent
                >телефон не указан</a
              >
            </template>
          </div>
        </div>
      </template>

      <template v-slot:item.email="{ item }">
        <div class="client-order__contact">
          <a :href="'mailto:' + item.email" class="client-order__phone">{{
            item.email
          }}</a>
        </div>
      </template>

      <template v-slot:item.role="{ item }">
        <v-chip :color="item.role | roleColor" dark>
          {{ item.role | roleName }}
        </v-chip>
      </template>

      <template v-slot:item.datetime.date="{ item }">
        <b>{{ item.datetime.date }}</b
        ><br />{{ item.datetime.time }}
      </template>

      <template v-slot:item.edit="{ item }">
        <v-icon class="mr-2" @click="editItem(item.id)"> mdi-pencil </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios'
import { DATA } from '@/router/paths-api.js'
export default {
  props: ['select', 'formState', 'alert'],
  data() {
    return {
      filter: {
        search: '',
        role: null,
      },
      total: 0,
      items: [],
      loading: true,
      options: {},
      headers: [
        {
          text: 'ID',
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
          text: 'E-mail',
          align: 'start',
          value: 'email',
        },
        {
          text: 'Роль',
          align: 'start',
          value: 'role',
        },
        {
          text: 'Дата',
          align: 'end',
          sortable: false,
          value: 'datetime.date',
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
    roleColor: function (value) {
      switch (value) {
        case 'admin':
          return '#0277BD'
        case 'manager':
          return 'warning'
        case 'user':
          return '#43A047'
      }
    },
    roleName: function (value) {
      switch (value) {
        case 'admin':
          return 'Администратор'
        case 'manager':
          return 'Менеджер'
        case 'user':
          return 'Клиент'
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
        .get(DATA.CRM.USERS.LIST, {
          params: {
            page,
            by: sortBy[0],
            sort: sort,
            per_page: itemsPerPage,
            search: this.filter.search,
            role: this.filter.role,
          },
        })
        .then((response) => {
          const resp = response.data

          this.total = resp.total
          this.items = resp.data
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
