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
        <v-icon class="theme--dark" style="font-size: 32px">
          mdi-layers-triple
        </v-icon>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              :disabled="Boolean(select)"
              v-on="on"
              v-on:click="updateFormDialog(true)"
            >
              mdi-plus
            </v-icon>
          </template>
          <span>Создать категорию</span>
        </v-tooltip>
      </v-sheet>
      <span class="mb-6 font-weight-regular user-info__title"
        >Управление категориями</span
      >
      <v-spacer></v-spacer>
      <transition name="fade" mode="out-in">
        <div
          class="d-flex is-disabled"
          transition="fab-transition"
          v-if="select"
          :disabled="alert.type === 'loading'"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                v-on:click="copyCategory(select)"
              >
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
                v-on:click="updateFormDialog(true)"
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
                  __confirm($event, 'deleteCategory', () =>
                    deleteCategory(select)
                  )
                "
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Удалить</span>
          </v-tooltip>
          <div class="mx-2"></div>
        </div>
      </transition>
    </v-card-title>
    <div
      style="
        width: 100%;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      v-if="!getCategories.length"
    >
      Нет не одной категории
    </div>
    <v-simple-table
      v-else
      class="b-table b-table-categories"
      :fixed-header="true"
      style="overflow-x: hidden; padding: 0 16px 16px 16px"
    >
      <thead>
        <tr class="b-tr">
          <th class="b-td green--text">ID</th>
          <th class="b-td text-center green--text">URL</th>
          <th class="b-td green--text">Название</th>
          <th class="b-td green--text">Описание</th>
          <th class="b-td green--text">Дата изменения</th>
          <th class="b-td green--text">Статус</th>
          <th class="b-td text-center green--text"></th>
        </tr>
      </thead>

      <tbody>
        <tr
          class="b-tr"
          :class="{ 'green lighten-3': select === item.id }"
          v-for="item in getCategories"
          :key="item.id"
        >
          <td class="b-td text-left">{{ item.id }}</td>
          <td
            class="b-td"
            style="
              text-align: center;
              padding-top: 0 !important;
              padding-bottom: 0 !important;
            "
          >
            <v-menu bottom right offset-y transition="scale-transition">
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  text
                  icon
                  v-bind="attrs"
                  v-on="on"
                  :disabled="!item.slug"
                >
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
          </td>
          <td class="b-td text-left">
            <template v-if="item.content[local].title">
              {{ item.content[local].title }}
            </template>
            <template v-else> Название отсутствует </template>
          </td>
          <td class="b-td text-left">
            <template v-if="item.content[local].desc">
              {{ item.content[local].desc | clearHtml }}
            </template>
            <template v-else> Описание отсутствует </template>
          </td>
          <td class="b-td text-left">
            {{ item.updated_at }}
          </td>
          <td class="b-td text-left">
            {{ item.status ? 'опубликовано' : 'черновик' }}
          </td>
          <td
            class="b-td is-disabled"
            style="
              text-align: right;
              padding-top: 0 !important;
              padding-bottom: 0 !important;
            "
            :disabled="alert.type === 'loading'"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  v-on:click="updateEditCategory(null)"
                  v-if="select === item.id"
                >
                  <v-icon color="green">mdi-dots-vertical</v-icon>
                </v-btn>
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  v-on:click="updateEditCategory({ ...item })"
                  v-else
                >
                  <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <span>{{ select === item.id ? 'Отменить' : 'Выбрать' }}</span>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const {
  mapGetters: mapGettersStoreCategories,
  mapMutations: mapMutationsStoreCategories,
  mapActions: mapActionsStoreCategories,
} = createNamespacedHelpers('store/categories')

export default {
  props: ['alert'],
  data: function () {
    return {
      local: process.env.VUE_APP_I18N_LOCALE,
    }
  },
  filters: {
    clearHtml: function (value) {
      return value.replace(/<\/?[^>]+(>|$)/g, '')
    },
  },
  computed: {
    ...mapGettersStoreCategories(['getCategories', 'getEditCategory']),
    select() {
      return this.getEditCategory?.id
    },
  },
  methods: {
    ...mapMutationsStoreCategories(['updateEditCategory', 'updateFormDialog']),
    ...mapActionsStoreCategories(['copyCategory', 'deleteCategory']),
  },
}
</script>
