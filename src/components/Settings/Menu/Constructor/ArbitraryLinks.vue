<template>
  <v-card class="ma-0 pa-0 elevation-0">
    <v-card-text class="pa-0">
      <v-form ref="form">
        <div class="d-flex align-center justify-space-between mb-6">
          <v-img
            style="height: 50px; width: 50px; max-width: 50px"
            class="b-add-img mr-6"
            :src="data.icon"
            v-on:click="selectFile(data)"
          >
            <svg x="0px" y="0px" viewBox="0 0 419.2 419.2" style="width: 25px">
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
            v-model="data.classes"
            label="CSS-класс"
            single-line
            dense
            outlined
            hide-details
          ></v-text-field>
        </div>

        <v-text-field
          v-model="data.link"
          label="Ссылка"
          single-line
          dense
          :placeholder="hostname"
          :rules="rules('Ссылка обязательна')"
          required
          outlined
        ></v-text-field>
        <v-text-field
          v-for="lang in langs"
          :key="lang.id"
          :label="`Название на (${lang.abbrev})`"
          v-model="data.content[lang.local].title"
          single-line
          dense
          :rules="rules('Название обязательно')"
          required
          outlined
        ></v-text-field>
        <template v-if="dataEdit">
          <v-btn
            dense
            color="primary"
            v-on:click="editArbitraryLink"
            :loading="btnLoading"
            class="mr-4"
          >
            Редактировать
          </v-btn>
          <v-btn dense color="error" v-on:click="$emit('delete', dataEdit)">
            Удалить
          </v-btn>
        </template>
        <v-btn
          v-if="!dataEdit"
          dense
          color="primary"
          class="text-caption"
          v-on:click="addArbitraryLink"
          :loading="btnLoading"
        >
          Добавить
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters: mapGettersLang } = createNamespacedHelpers('lang')
const { mapGetters: mapGettersMenu } = createNamespacedHelpers('settings/menu')

export default {
  props: {
    dataEdit: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data: function () {
    return {
      data: {
        icon: '',
        link: '',
        content: {},
      },
      btnLoading: false,
      hostname: window.location.origin,
    }
  },
  created: function () {
    this._setup()
  },
  computed: {
    ...mapGettersMenu({
      selectedAreaVisibility: 'getSelectedAreaVisibility',
    }),
    ...mapGettersLang({
      langs: 'getLangs',
    }),
  },
  methods: {
    _setup: function () {
      var dataEdit = {}
      if (this.dataEdit) {
        dataEdit = JSON.parse(JSON.stringify(this.dataEdit))
        this.data.content = dataEdit.instance.content
        this.data.link = dataEdit.instance.link
        this.data.id = dataEdit.instance.id
        this.data.id_menu = dataEdit.id
        this.data.icon = dataEdit.icon
        this.data.classes = dataEdit.classes
        return
      }
      this.langs.forEach((item) => {
        const data = {
          title: '',
        }
        this.$set(this.data.content, item.local, data)
      })
    },
    clearData: function () {
      this.data = {
        link: '',
        content: {},
      }
      this._setup()
    },
    resetForm: function () {
      this.$refs.form.reset()
    },
    rules: function (requiredMessage) {
      return [(v) => !!v || requiredMessage]
    },
    editArbitraryLink() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.btnLoading = true
      this.data.area_visibility_id = this.selectedAreaVisibility
      this.$store
        .dispatch('ArbitraryLinks/editArbitraryLink', this.data)
        .then((res) => {
          if (res.status === 200) {
            this.data.id = res.data.id
            this.data.link = res.data.link
            this.data.content = res.data.content
          }
        })
        .catch(() => {})
        .finally(() => {
          this.btnLoading = false
          this.$store.commit('Menu/updateChanges', false)
        })
    },
    selectFile: function (obj) {
      console.log(obj)
      window.open(
        '/laravel-filemanager?type=image',
        'FileManager',
        'width=1280,height=700'
      )
      var that = this
      window.SetUrl = function (items) {
        var file_path = items
          .map(function (item) {
            return item.url
          })
          .join(',')
        if (that.dataEdit) {
          that.$set(that.dataEdit, 'icon', file_path)
        }
        obj.icon = file_path
      }
    },
    addArbitraryLink: function () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.btnLoading = true
      this.data.area_visibility_id = this.selectedAreaVisibility
      this.$store
        .dispatch('ArbitraryLinks/addArbitraryLink', this.data)
        .then((response) => {
          this.$store.commit('Menu/addMenu', {
            selectedAreaVisibility: this.selectedAreaVisibility,
            items: [response.data],
          })
          this.clearData()
          this.resetForm()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
  },
}
</script>
