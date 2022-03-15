<template>
  <v-col>
    <v-container fluid tag="section">
      <v-card class="ma-0">
        <v-container
          id="regular-tables"
          fluid
          tag="section"
          class="menu-wrap"
          style="border-radius: 4px; overflow: hidden"
        >
          <v-tabs v-model="tab" background-color="success" dark fixed-tabs>
            <v-tabs-slider></v-tabs-slider>
            <v-tab
              v-for="(tab, index) in tabs"
              :key="index"
              :href="`#tab-${index}`"
            >
              {{ tab.title }}
              <v-icon v-if="tab.icons">mdi-phone</v-icon>
            </v-tab>

            <v-tab-item
              v-for="(tab, index) in tabs"
              :key="index"
              :value="'tab-' + index"
            >
              <component :is="tab.component"></component>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-card>
    </v-container>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Constructor from './Menu/Constructor/Index.vue'
import List from './Menu/List.vue'

const { mapActions: mapActionsMenu } = createNamespacedHelpers('settings/menu')
const { mapActions: mapActionsCategories } =
  createNamespacedHelpers('categories')
const { mapActions: mapActionsCollections } =
  createNamespacedHelpers('collections')
const { mapActions: mapActionsPages } = createNamespacedHelpers('pages')

export default {
  components: {
    Constructor,
    List,
  },
  data: function () {
    return {
      tab: null,
      tabs: [
        {
          title: 'Редактор Меню',
          component: 'constructor',
        },
        {
          title: 'Управление областями',
          component: 'list',
        },
      ],
    }
  },
  beforeMount() {
    this.getMenuData()
    this.getCategories()
    this.getCollections()
    this.getPages()
  },
  methods: {
    ...mapActionsMenu(['getMenuData']),
    ...mapActionsCategories(['getCategories']),
    ...mapActionsCollections(['getCollections']),
    ...mapActionsPages(['getPages']),
  },
}
</script>
