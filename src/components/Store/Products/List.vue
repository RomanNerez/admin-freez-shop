<template>
  <v-card>
    <v-card-title class="py-0 table-header__btn is-copy-control">
      <v-sheet
        style="
          position: relative;
          top: -24px;
          transition: 0.3s ease;
          z-index: 1;
        "
        class="pa-7 text-center green rounded b-user-info__square"
        elevation="5"
      >
        <v-icon class="theme--dark" style="font-size: 32px"> mdi-unity </v-icon>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              :disabled="Boolean(select)"
              v-on="on"
              v-on:click="$emit('update:formState', true)"
            >
              mdi-plus
            </v-icon>
          </template>
          <span>Создать продукт</span>
        </v-tooltip>
      </v-sheet>

      <v-row class="pl-7 pr-10">
        <v-col cols="8" class="pt-0 pb-7">
          <v-text-field
            v-model="filter.search"
            append-icon="mdi-magnify"
            label="ID, Название, Ссылка"
            single-line
            hide-details
            color="green"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="4" class="pt-0 pb-7">
          <v-select
            v-model="filter.status"
            :items="[
              {
                val: 1,
                name: 'Опубликовано',
              },
              {
                val: 0,
                name: 'Черновик',
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
      </v-row>

      <div
        class="d-flex is-disabled"
        transition="fab-transition"
        :disabled="alert.type === 'loading' || !select"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on" v-on:click="copyItem">
              mdi-content-copy
            </v-icon>
          </template>
          <span>Копировать</span>
        </v-tooltip>
        <div class="mx-2"></div>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              v-on:click="$emit('update:formState', true)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Редактировать</span>
        </v-tooltip>
        <div class="mx-2"></div>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              v-on:click="
                $emit('confirm', $event, {
                  type: 'deleteProduct',
                  action: deleteItem,
                })
              "
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Удалить</span>
        </v-tooltip>
        <div class="mx-2"></div>
      </div>
    </v-card-title>

    <v-data-table
      class="orders-table px-6"
      v-model="selected"
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="total"
      :loading="loading"
      :single-select="true"
      :footer-props="{
        'items-per-page-options': [5, 10, 15],
      }"
    >
      <template v-slot:item.url="{ item }">
        <v-menu bottom right offset-y transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn text icon v-bind="attrs" v-on="on" :disabled="!item.slug">
              <v-icon>mdi-share-variant-outline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <a :href="item.url" target="blank">{{ item.url }}</a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:item.content.ru.title="{ item }">
        <v-row class="py-6">
          <v-col class="d-flex flex-row align-center py-0">
            <v-avatar class="mr-4" size="42px" v-if="item.images.base.length">
              <img alt="Avatar" :src="item.images.base[0].source" />
            </v-avatar>
            <span>
              {{ item.content.ru.title }}
            </span>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.order="{ item }">
        <v-text-field
          class="py-3"
          style="max-width: 100px"
          type="number"
          color="success"
          v-on:input="setOrder(item)"
          v-model.number="item.order"
          :loading="item.pending"
          solo
          dense
          hide-details
        ></v-text-field>
      </template>

      <template v-slot:item.status="{ item }">
        <span class="orders-table__status" :class="item.status | statusColor">
          <v-icon> mdi-circle </v-icon>
          {{ item.status ? 'опубликовано' : 'черновик' }}
        </span>
      </template>

      <template v-slot:item.edit="{ item }">
        <div class="is-disabled" :disabled="alert.type === 'loading'">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                v-on:click="selectedId($event, item.id)"
              >
                <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <span>{{ select === item.id ? 'Отменить' : 'Выбрать' }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios'
import { DATA } from '@/router/paths-api'
export default {
  props: [
    'select',
    'formState',
    'items',
    'edit',
    'edt',
    'langs',
    'related',
    'alert',
    'total',
    'loading',
  ],
  data: function () {
    return {
      location: window.location.origin,
      options: {},
      selected: [],
      filter: {
        search: '',
        status: null,
      },
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        {
          text: 'URL',
          align: 'start',
          sortable: false,
          value: 'url',
        },
        {
          text: 'Название',
          align: 'start',
          sortable: false,
          value: 'content.ru.title',
        },
        {
          text: 'Позиция',
          align: 'start',
          value: 'order',
        },
        {
          text: 'Статус',
          align: 'start',
          sortable: false,
          value: 'status',
        },
        {
          text: 'Обновление',
          align: 'end',
          value: 'updated_at',
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
    edit() {
      this.selected = this.edit.id ? [this.edit] : []
    },
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
          return 'error-pay'
        case 0:
          return 'no-pay'
        case 1:
          return 'true-pay'
      }
    },
  },
  computed: {
    list: function () {
      return this.items
    },
  },
  methods: {
    getList() {
      this.$parent.getData()
    },
    setOrder: function (item) {
      this.$set(item, 'pending', true)

      clearTimeout(window._debounce)
      window._debounce = setTimeout(() => {
        if ((item.order !== null) & (item.order !== '')) {
          axios
            .post(DATA.STORE.PRODUCTS.ORDER, {
              id: item.id,
              order: item.order,
            })
            .then(() => {
              this.getList()
            })
            .catch((error) => {
              let data = error.response.data,
                text = 'Неизвестная ошибка, повторите попытку'

              if (data.errors) {
                text = Object.values(data.errors)[0][0]
              } else if (data.message) {
                text = data.message
              }

              this.$emit('update:alert', {
                type: 'error',
                text: text,
              })
            })
            .finally(() => {
              item.pending = false
            })
        } else {
          item.pending = false
        }
      }, 1000)
    },
    selectedId: function (e, item) {
      this.$emit('update:select', this.select === item ? null : item)
    },
    copyItem: function () {
      this.$emit('update:alert', {
        type: 'loading',
        text: 'Копирование продукта...',
      })

      axios
        .post(DATA.STORE.PRODUCTS.COPY, {
          _token: window._token,
          id: this.select,
        })
        .then(() => {
          this.getList()

          this.$emit('update:select', null)
          this.$emit('update:alert', {
            type: 'success',
            text: 'Продукт успешно скопирован',
          })
        })
        .catch((error) => {
          let data = error.response.data,
            text = 'Неизвестная ошибка, повторите попытку'

          if (data.errors) {
            text = Object.values(data.errors)[0][0]
          } else if (data.message) {
            text = data.message
          }

          this.$emit('update:alert', {
            type: 'error',
            text: text,
          })
        })
    },
    deleteItem: function () {
      this.$emit('update:alert', {
        type: 'loading',
        text: 'Удаление продукта...',
      })

      axios
        .post(DATA.STORE.PRODUCTS.DELETE, {
          _token: window._token,
          id: this.select,
        })
        .then(() => {
          this.getList()

          this.$emit('update:select', null)
          this.$emit('update:alert', {
            type: 'success',
            text: 'Продукт успешно удален',
          })
        })
        .catch(() => {
          this.$emit('update:alert', {
            type: 'error',
            text: 'Неизвестная ошибка, повторите попытку',
          })
        })
    },
  },
}
</script>
