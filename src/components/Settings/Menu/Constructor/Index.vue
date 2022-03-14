<template>
  <v-card class="mt-0 mb-0 elevation-0" min-height="400px">
    <v-row>
      <v-col class="px-8 pb-2 pt-12">
        <div class="text-center" v-if="!areaVisibilities.length">
          <v-sheet color="lighten-2">
            Довавьте область для работы с конструктором
          </v-sheet>
        </div>
        <template v-if="areaVisibilities.length">
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedAreaVisibility"
                :items="areaVisibilities"
                label="Выберите меню для изменения:"
                item-text="title"
                item-value="id"
                outlined
                hide-details
                class="mb-6"
              ></v-select>

              <panel-left></panel-left>
            </v-col>
            <v-col cols="12" md="8">
              <panel-right></panel-right>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PanelLeft from './PanelLeft'
import PanelRight from './PanelRight'

import { createNamespacedHelpers } from 'vuex'

const { mapGetters: mapGettersMenu, mapMutations: mapMutationsMenu } =
  createNamespacedHelpers('settings/menu')

export default {
  components: {
    PanelLeft,
    PanelRight,
  },
  data: function () {
    return {}
  },
  mounted() {
    this.setDefaultValueSelectedAreaVisibility()
  },
  computed: {
    ...mapGettersMenu(['areaVisibilities']),
    selectedAreaVisibility: {
      ...mapGettersMenu({
        get: 'getSelectedAreaVisibility',
      }),
      set(value) {
        this.updatedSelectedAreaVisibility(value)
      },
    },
  },
  methods: {
    ...mapMutationsMenu(['updatedSelectedAreaVisibility']),
    setDefaultValueSelectedAreaVisibility() {
      if (this.areaVisibilities.length) {
        this.selectedAreaVisibility = this.areaVisibilities[0].id
      }
    },
  },
}
</script>
