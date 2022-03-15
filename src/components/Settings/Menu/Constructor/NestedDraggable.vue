<template>
  <draggable
    :list="list"
    :value="value"
    @input="emitter"
    tag="ul"
    handle=".handle"
    group="menu"
    class="group-item"
    v-bind="options"
  >
    <li v-for="element in realValue" :key="element.id" :data-id="element.id">
      <div class="border-line background-green">
        <v-expansion-panels accordion>
          <v-expansion-panel :key="element.id">
            <v-expansion-panel-header class="green lighten-5 text-body-2 pl-4">
              <div>
                <v-icon class="handle cursor-move mr-1">mdi-drag</v-icon>
                <v-icon class="mr-2" @click="toggleChildren(element.id)">{{
                  idChildren.indexOf(element.id) !== -1
                    ? 'mdi-arrow-down'
                    : 'mdi-arrow-left'
                }}</v-icon>
                <span>{{ element.instance.content.ru.title }}</span>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content
              class="border-line-top pa-0 edit-item-menu"
            >
              <template v-if="element.instance_type != 'arbitrary_links'">
                <div class="d-flex align-center justify-space-between mb-4">
                  <v-img
                    style="height: 56px; width: 56px; max-width: 56px"
                    class="b-add-img mr-8"
                    :src="element.icon"
                    v-on:click="selectFile(element)"
                  >
                    <svg
                      x="0px"
                      y="0px"
                      viewBox="0 0 419.2 419.2"
                      style="width: 25px"
                    >
                      <circle cx="158" cy="144.4" r="28.8" />
                      <path
                        d="M394.4,250.4c-13.6-12.8-30.8-21.2-49.6-23.6V80.4c0-15.6-6.4-29.6-16.4-40C318,30,304,24,288.4,24h-232c-15.6,0-29.6,6.4-40,16.4C6,50.8,0,64.8,0,80.4v184.4V282v37.2c0,15.6,6.4,29.6,16.4,40c10.4,10.4,24.4,16.4,40,16.4h224.4c14.8,12,33.2,19.6,53.6,19.6c23.6,0,44.8-9.6,60-24.8c15.2-15.2,24.8-36.4,24.8-60C419.2,286.8,409.6,265.6,394.4,250.4z M21.2,80.4c0-9.6,4-18.4,10.4-24.4c6.4-6.4,15.2-10.4,24.8-10.4h232c9.6,0,18.4,4,24.8,10.4c6.4,6.4,10.4,15.2,10.4,24.8v124.8l-59.2-59.2c-4-4-10.8-4.4-15.2,0L160,236l-60.4-60.8c-4-4-10.8-4.4-15.2,0l-63.2,64V80.4z M56,355.2v-0.8c-9.6,0-18.4-4-24.8-10.4c-6-6.4-10-15.2-10-24.8V282v-12.4L92,198.4l60.4,60.4c4,4,10.8,4,15.2,0l89.2-89.6l58.4,58.8c-1.2,0.4-2.4,0.8-3.6,1.2c-1.6,0.4-3.2,0.8-5.2,1.6c-1.6,0.4-3.2,1.2-4.8,1.6c-1.2,0.4-2,0.8-3.2,1.6c-1.6,0.8-2.8,1.2-4,2c-2,1.2-4,2.4-6,3.6c-1.2,0.8-2,1.2-3.2,2c-0.8,0.4-1.2,0.8-2,1.2c-3.6,2.4-6.8,5.2-9.6,8.4c-15.2,15.2-24.8,36.4-24.8,60c0,6,0.8,11.6,2,17.6c0.4,1.6,0.8,2.8,1.2,4.4c1.2,4,2.4,8,4,12v0.4c1.6,3.2,3.2,6.8,5.2,9.6H56z M378.8,355.2c-11.6,11.6-27.2,18.4-44.8,18.4c-16.8,0-32.4-6.8-43.6-17.6c-1.6-1.6-3.2-3.6-4.8-5.2c-1.2-1.2-2.4-2.8-3.6-4c-1.6-2-2.8-4.4-4-6.8c-0.8-1.6-1.6-2.8-2.4-4.4c-0.8-2-1.6-4.4-2-6.8c-0.4-1.6-1.2-3.6-1.6-5.2c-0.8-4-1.2-8.4-1.2-12.8c0-17.6,7.2-33.2,18.4-44.8c11.2-11.6,27.2-18.4,44.8-18.4s33.2,7.2,44.8,18.4c11.6,11.6,18.4,27.2,18.4,44.8C397.2,328,390,343.6,378.8,355.2z"
                      />
                      <path
                        d="M341.6,267.6c-0.8-0.8-2-1.6-3.6-2.4c-1.2-0.4-2.4-0.8-3.6-0.8c-0.4,0-0.4,0-0.4,0c-0.4,0-0.4,0-0.4,0c-1.2,0-2.4,0.4-3.6,0.8c-1.2,0.4-2.4,1.2-3.6,2.4l-24.8,24.8c-4,4-4,10.8,0,15.2c4,4,10.8,4,15.2,0l6.4-6.4v44c0,6,4.8,10.8,10.8,10.8s10.8-4.8,10.8-10.8v-44l6.4,6.4c4,4,10.8,4,15.2,0c4-4,4-10.8,0-15.2L341.6,267.6z"
                      />
                    </svg>
                  </v-img>

                  <v-text-field
                    v-model="element.classes"
                    label="CSS-класс"
                    single-line
                    outlined
                    hide-details
                  ></v-text-field>
                </div>

                <v-btn dense color="error" @click="deleteMenu({ ...element })">
                  Удалить
                </v-btn>
              </template>
              <ArbitraryLinks
                v-else
                :dataEdit="element"
                v-on:delete="deleteMenu"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <slide-up-down :active="idChildren.indexOf(element.id) !== -1">
        <nested-draggable
          :data-parent-id="element.id"
          class="sub-group-item ml-6"
          :parent="element"
          :list="element.children"
          :options="options"
        />
      </slide-up-down>
    </li>
  </draggable>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import draggable from 'vuedraggable'
import SlideUpDown from 'vue-slide-up-down'
import ArbitraryLinks from './ArbitraryLinks'

const {
  mapGetters: mapGettersMenu,
  mapMutations: mapMutationsMenu,
  mapActions: mapActionsMenu,
} = createNamespacedHelpers('settings/menu')

export default {
  name: 'nested-draggable',
  components: {
    ArbitraryLinks,
    draggable,
    SlideUpDown,
  },
  props: {
    value: {
      required: false,
      type: Array,
      default: null,
    },
    list: {
      required: false,
      type: Array,
      default: null,
    },
    parent: {
      required: false,
      default: null,
    },
    options: {
      required: false,
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      idChildren: [],
    }
  },
  computed: {
    realValue() {
      return this.value ? this.value : this.list
    },
    ...mapGettersMenu({
      selectedAreaVisibility: 'getSelectedAreaVisibility',
    }),
  },
  methods: {
    ...mapMutationsMenu(['updatedMenu']),
    ...mapActionsMenu({ deleteMenuAction: 'deleteMenu' }),
    toggleChildren(id) {
      let index = this.idChildren.indexOf(id)
      if (index !== -1) {
        this.idChildren.splice(index, 1)
      } else {
        this.idChildren.push(id)
      }
    },
    emitter(value) {
      this.$emit('input', value)
    },
    deleteMenu(element) {
      delete element.instance
      delete element.children
      this.deleteMenuAction({
        element,
      })
        .then((response) => {
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
        .finally(() => {})
    },
    selectFile: function (obj) {
      window.open(
        '/laravel-filemanager?type=image',
        'FileManager',
        'width=1280,height=700'
      )

      window.SetUrl = function (items) {
        var file_path = items
          .map(function (item) {
            return item.url
          })
          .join(',')
        obj.icon = file_path
      }
    },
  },
}
</script>
<style scoped>
.sub-group-item {
  list-style: none;
  min-height: 1px;
  padding: 0;
}
li.move-active button.v-expansion-panel-header {
  opacity: 0.25;
}
.background-green {
  background-color: #e8f5e9;
}
.v-expansion-panels {
  border-radius: 0px;
}
.v-expansion-panel::before {
  box-shadow: none !important;
}
.border-line {
  border: 1px dashed #1b5e20 !important;
  margin: 0 0 5px 0;
}
.border-line-top {
  border-top: 1px dashed #1b5e20 !important;
}
.cursor-move {
  cursor: move;
}
</style>
