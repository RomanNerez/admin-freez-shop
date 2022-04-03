<template>
  <div class="b-steps">
    <div class="b-colum">
      <div class="groups-list groups-list--chose">
        <div class="groups-list__wrap">
          <div
            class="groups-list__items"
            v-for="group in groups"
            :key="group.id"
          >
            <div class="groups-list__items-head">
              <div class="groups-list__name">
                <span class="items-head__title">{{
                  group.content.ru.title
                }}</span>
              </div>
            </div>

            <div class="groups-list__items-wrap">
              <div
                class="groups-list__items-item"
                v-for="item in group.subs"
                :key="item.id"
              >
                <v-checkbox
                  class="ma-0"
                  v-model="value.subs"
                  :value="item.id"
                  color="success"
                  hide-details
                ></v-checkbox>
                <div class="groups-list__box">
                  <span>{{ item.content.ru.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters: mapGettersStoreCategories } =
  createNamespacedHelpers('store/categories')
const { mapGetters: mapGettersStoreGroups } =
  createNamespacedHelpers('store/groups')

export default {
  props: [
    'value',
    'local',
    'status',
    'langs',
    'select',
    'tabSelect',
    'other',
    'index',
    'related',
  ],
  data: function () {
    return {
      alert: {
        show: false,
        text: null,
      },
    }
  },
  computed: {
    ...mapGettersStoreCategories(['getCategories']),
    ...mapGettersStoreGroups(['getGroups']),
    rootCatalog: function () {
      return this.getCategories.find((category) => category.is_root)
    },
    groups: function () {
      // let groups

      // switch (this.related) {
      //   case 'store':
      //     groups = this.$store.getters.storeData.data.groups
      //     break
      //   case 'services':
      //     groups = this.$store.getters.servicesData.data.groups
      //     break
      // }
      return this.getGroups.filter((item) => {
        return (
          item.status &&
          item.subs.length &&
          (item.categories_id === this.other ||
            (this.rootCatalog && item.categories_id === this.rootCatalog.id))
        )
      })
    },
  },
  methods: {
    validate: function () {
      if (this.value.status && !this.value.subs.length) {
        return {
          result: false,
          index: this.index,
          alert: 'Выберите хотя бы одну группу, перед публикацией',
        }
      }
      return {
        result: true,
      }
    },
  },
}
</script>
