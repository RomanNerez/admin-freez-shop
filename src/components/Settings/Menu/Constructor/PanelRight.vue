<template>
  <v-card class="mt-0 mb-0 elevation-1">
    <v-card-title class="justify-space-between py-3">
      <small> Добавьте элементы меню из столбца слева. </small>

      <v-btn color="success" v-on:click="updateMenu" :loading="btnLoading">
        Сохранить
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text min-heigth="100px" class="pb-2">
      <div
        style="min-height: 200px; width: 100%"
        class="border-line-red d-flex align-center justify-center background-red mb-2"
        v-if="!getMenuList.length"
      >
        <div>
          <div class="d-flex justify-center">
            <v-icon size="50" color="#EF5350">mdi-alert-circle-outline</v-icon>
          </div>
          <div class="text-subtitle-1 mt-2">
            Эта область меню еще не настроена
          </div>
        </div>
      </div>
      <form name="menu" ref="menu" id="menu">
        <nested-draggable
          class="pl-0"
          v-model="getMenuList"
          :parent.sync="getMenuList"
          :options="{
            selectedAreaVisibility,
            animation: 200,
            ghostClass: 'move-active',
          }"
        />
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import NestedDraggable from './NestedDraggable'

const {
  mapGetters: mapGettersMenu,
  mapMutations: mapMutationsMenu,
  mapActions: mapActionsMenu,
} = createNamespacedHelpers('settings/menu')

export default {
  components: {
    NestedDraggable,
  },
  data: function () {
    return {
      btnLoading: false,
    }
  },
  watch: {
    menuList: {
      deep: true,
      handler() {
        this.updateChanges(true)
      },
    },
  },
  computed: {
    ...mapGettersMenu({
      selectedAreaVisibility: 'getSelectedAreaVisibility',
      menuList: 'getMenuList',
      changes: 'getChanges',
    }),
    getMenuList: {
      get() {
        if (
          !this.selectedAreaVisibility ||
          Array.isArray(this.menuList) ||
          this.menuList[this.selectedAreaVisibility] === undefined
        )
          return []
        return this.menuList[this.selectedAreaVisibility]
      },
      set(value) {
        this.updatedMenu({
          selectedAreaVisibility: this.selectedAreaVisibility,
          value,
        })
      },
    },
  },
  methods: {
    ...mapMutationsMenu(['updateChanges', 'updatedMenu']),
    ...mapActionsMenu({
      updateMenuAction: 'updateMenu',
    }),
    getDataMenuListAggregated(array = []) {
      array.forEach((item, i) => {
        delete item.area_visibility
        delete item.instance
        item.order = i + 1
        if (item.children && item.children.length) {
          this.getDataMenuListAggregated(item.children)
        }
      })
      return array
    },
    updateMenu() {
      this.btnLoading = true
      let data = this.getDataMenuListAggregated(
        JSON.parse(JSON.stringify(this.getMenuList))
      )
      this.updateMenuAction(data)
        .then((response) => {
          this.updateChanges(false)
          this.updatedMenu({
            selectedAreaVisibility: this.selectedAreaVisibility,
            value: response.data,
          })
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            group: 'notify',
            title: 'Внимание!',
            test: 'Упс... Произошла ошибка, перезагрузите страницу',
          })
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
  },
}
</script>

<style scoped>
.group-item {
  list-style: none;
}
.v-expansion-panels {
  border-radius: 0px;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}
.border {
  border: 1px dashed orange;
}
.background-green {
  background-color: #e8f5e9;
}
.background-red {
  background-color: #ffebee;
}
.border-line-red {
  border: 1px dashed #ef5350 !important;
}
.border-line {
  border: 1px dashed #1b5e20 !important;
  margin: 0 0 5px 0;
}
.border-line-top {
  border-top: 1px dashed #1b5e20 !important;
}
</style>
