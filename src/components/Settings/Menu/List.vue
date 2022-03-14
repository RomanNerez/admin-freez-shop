<template>
  <v-card class="mt-0 mb-0 elevation-0">
    <v-card-text class="mt-4">
      <v-row>
        <v-col>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6" sm="5">
                <v-text-field
                  v-model="title"
                  :counter="15"
                  :rules="titleRules"
                  label="Называние"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <v-select
                  v-model="localed"
                  :items="getSelectData"
                  item-text="title"
                  item-value="key"
                  :rules="localedRules"
                  label="Расположение"
                  required
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3">
                <v-btn
                  style="margin-top: 1px"
                  width="100%"
                  color="primary"
                  v-on:click="getAction"
                  :loading="btnLoading"
                  x-large
                  :disabled="!getSelectData.length && !statusEdit"
                >
                  {{ statusEdit ? 'Редактировать' : 'Сохранить' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="mt-0 mb-0 elevation-0 d-flex align-center">
            <v-card-text class="pa-0">
              <div class="text-center" v-show="!areaVisibilities.length">
                <v-sheet color="lighten-2">
                  На данный момент нет не одной области
                </v-sheet>
              </div>
              <v-simple-table v-show="areaVisibilities.length">
                <template v-slot:default>
                  <thead class="custom-thead">
                    <tr>
                      <th>Название</th>
                      <th>Расположение</th>
                      <th>Создано</th>
                      <th class="text-right">Последнее изменение</th>
                      <th class="text-right">Действия</th>
                    </tr>
                  </thead>
                  <transition-group name="list" tag="tbody">
                    <tr
                      v-for="item in areaVisibilities"
                      :key="item.id"
                      class="list-complete-item"
                      :class="{ 'green lighten-3': edit.id === item.id }"
                    >
                      <td>{{ item.title }}</td>
                      <td>{{ item.localed | getTitle }}</td>
                      <td>{{ item.created_at }}</td>
                      <td class="text-right">{{ item.updated_at }}</td>
                      <td class="text-right">
                        <v-btn icon v-on:click="getAreaVisibilityForEdit(item)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon v-on:click="deleteAreaVisibility(item.id)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </transition-group>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const {
  mapGetters: mapGettersMenu,
  mapMutations: mapMutationsMenu,
  mapActions: mapActionsMenu,
} = createNamespacedHelpers('settings/menu')

export default {
  data() {
    return {
      title: '',
      localed: null,
      btnLoading: false,
      edit: {},
      titleRules: [
        (v) => !!v || 'Название обязательно!',
        (v) =>
          (v && v.length <= 16) || 'Название не дожно превышать 15-ти символов',
      ],
      localedRules: [(v) => !!v || 'Выберете расположение!'],
    }
  },
  computed: {
    ...mapGettersMenu(['areaVisibilities']),
    ...mapGettersMenu({ selectedAreaVisibility: 'getSelectedAreaVisibility' }),
    statusEdit() {
      return !!Object.keys(this.edit).length
    },
    getAction() {
      return this.statusEdit ? this.editAreaVisibility : this.addAreaVisibility
    },
    getSelectData() {
      return [
        {
          title: 'Навигация',
          key: 'navbar',
        },
        {
          title: 'Каталог',
          key: 'catalog',
        },
        {
          title: 'Коллекции',
          key: 'collections',
        },
        {
          title: 'Футтер',
          key: 'footer',
        },
      ].filter((item) => {
        let exist = true
        this.areaVisibilities.forEach((area) => {
          if (area.localed == item.key) exist = false
        })
        return exist
      })
    },
  },
  filters: {
    getTitle(value) {
      switch (value) {
        case 'navbar':
          return 'Навигация'
        case 'catalog':
          return 'Каталог'
        case 'collections':
          return 'Коллекции'
        case 'footer':
          return 'Футтер'
        default:
          return 'Не определенно'
      }
    },
  },
  methods: {
    ...mapMutationsMenu({
      addMenu: 'addMenu',
      addAreaVisibilityMutation: 'addAreaVisibility',
      editAreaVisibilityMutation: 'editAreaVisibility',
      deleteMenuByAreaVisibility: 'deleteMenuByAreaVisibility',
      deleteAreaVisibilityMutation: 'deleteAreaVisibility',
    }),
    ...mapActionsMenu({
      editAreaVisibilityActions: 'editAreaVisibility',
      deleteAreaVisibilityActions: 'deleteAreaVisibility',
      addAreaVisibilityActions: 'addAreaVisibility',
    }),
    getAreaVisibilityForEdit(item) {
      if (this.edit.id == item.id) {
        this.edit = {}
        this.title = ''
        this.localed = null
        this.$refs.form.reset()
        return
      }
      this.title = item.title
      this.localed = item.localed
      this.edit = item
    },
    editAreaVisibility() {
      if (!this.$refs.form.validate()) {
        return
      }
      const data = {
        id: this.edit.id,
        title: this.title,
        localed: this.localed,
      }
      this.btnLoading = true
      this.editAreaVisibilityActions(data)
        .then((response) => {
          this.editAreaVisibilityMutation(response.data)
          this.edit = {}
          this.localed = null
          this.title = ''
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
          this.$refs.form.reset()
        })
    },
    deleteAreaVisibility(id) {
      this.deleteAreaVisibilityActions({ id })
        .then(() => {
          this.getAreaVisibilityForEdit(this.edit)
          this.deleteAreaVisibilityMutation(id)
          this.deleteMenuByAreaVisibility(id)
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            group: 'notify',
            title: 'Внимание!',
            test: 'Упс... Произошла ошибка, перезагрузите страницу',
          })
        })
    },
    addAreaVisibility() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.btnLoading = true
      const data = {
        title: this.title,
        localed: this.localed,
      }
      this.addAreaVisibilityActions(data)
        .then((response) => {
          this.addAreaVisibilityMutation(response.data)
          this.addMenu({
            selectedAreaVisibility: response.data.id,
            items: [],
          })
          this.title = ''
          this.localed = null
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
          this.$refs.form.reset()
        })
    },
  },
}
</script>

<style>
.list-complete-item {
  transition: all 1s;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
