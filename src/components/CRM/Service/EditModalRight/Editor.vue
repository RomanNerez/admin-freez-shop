<template>
  <v-overlay
    v-if="formDialog"
    :value="formDialog"
    class="b-overlay"
    z-index="7"
  >
    <div class="b-drawer b-drawer--right" :class="{ active: formDialogRight }">
      <v-card light class="b-new-category rounded-0 mt-0 mb-0 b-new-article">
        <v-form>
          <v-card-title class="px-0 pt-0">
            <!--<span class="headline">
                            {{ !selected ? 'Новая категория' : 'Редактирование' }}
                        </span>-->
            <v-select
              style="margin-right: 5% !important"
              class="b-lang"
              v-model.trim="editor.status"
              :items="[
                {
                  val: -1,
                  name: 'Отменен',
                },
                {
                  val: 0,
                  name: 'Новый',
                },
                {
                  val: 1,
                  name: 'В работе',
                },
                {
                  val: 2,
                  name: 'Доставка',
                },
                {
                  val: 3,
                  name: 'Выполнен',
                },
              ]"
              item-value="val"
              item-text="name"
              label="Статус"
              color="green"
              solo
            ></v-select>
            <v-select
              class="b-lang"
              v-model.trim="editor.pay"
              :items="[
                {
                  val: 0,
                  name: 'Не оплачен',
                },
                {
                  val: 1,
                  name: 'Оплачен',
                },
              ]"
              item-value="val"
              item-text="name"
              color="green"
              label="Оплата"
              solo
            ></v-select>

            <v-btn
              :loading="pending"
              class="b-btn"
              color="green darken-1"
              v-on:click="save"
            >
              Сохранить
            </v-btn>
            <v-btn
              class="b-close"
              large
              color="red"
              icon
              v-on:click="closeModal($event)"
            >
              <svg
                height="329pt"
                fill="currentColor"
                viewBox="0 0 329.26933 329"
                width="329pt"
              >
                <path
                  d="m21.339844 329.398438c-5.460938 0-10.925782-2.089844-15.082032-6.25-8.34375-8.339844-8.34375-21.824219 0-30.164063l286.589844-286.59375c8.339844-8.339844 21.824219-8.339844 30.164063 0 8.34375 8.339844 8.34375 21.824219 0 30.164063l-286.589844 286.59375c-4.183594 4.179687-9.621094 6.25-15.082031 6.25zm0 0"
                ></path>
                <path
                  d="m307.929688 329.398438c-5.460938 0-10.921876-2.089844-15.082032-6.25l-286.589844-286.59375c-8.34375-8.339844-8.34375-21.824219 0-30.164063 8.339844-8.339844 21.820313-8.339844 30.164063 0l286.589844 286.59375c8.34375 8.339844 8.34375 21.824219 0 30.164063-4.160157 4.179687-9.621094 6.25-15.082031 6.25zm0 0"
                ></path>
              </svg>
            </v-btn>
          </v-card-title>

          <v-card class="mb-9">
            <v-tabs
              background-color="light-blue darken-1"
              v-model="tabSelect"
              show-arrows
              dark
              fixed-tabs
            >
              <v-tab v-for="(component, index) in components" :key="index">
                {{ component.t }}
              </v-tab>
            </v-tabs>
          </v-card>

          <template v-for="(component, index) in components">
            <component
              v-show="tabSelect === index"
              :key="component.c"
              v-model="editor"
              :tab-select.sync="tabSelect"
              :invalid.sync="valid"
              :alert.sync="alert.option"
              :index="index"
              :ref="component.c"
              :is="component.c"
            ></component>
          </template>
        </v-form>
      </v-card>

      <v-snackbar
        v-model="alert.show"
        absolute
        top
        right
        elevation="24"
        :color="alertColor"
        :timeout="alert.option.type === 'loading' ? -1 : 4000"
      >
        <span v-html="alert.option.text"></span>
        <template v-slot:action="{ attrs }">
          <v-btn
            :loading="alert.option.type === 'loading'"
            color="white"
            text
            v-bind="attrs"
            @click="alert.show = false"
          >
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-overlay>
</template>

<script>
import html_hidden from '@/helpers/html_hidden'
import axios from 'axios'
import ParamsOrder from './ParamsOrder'
import UserOrder from './UserOrder'
import CommentOrder from './CommentOrder'
import { DATA } from '@/router/paths-api'

export default {
  props: ['formDialog', 'edit', 'selected', 'edt'],
  components: {
    ParamsOrder,
    UserOrder,
    CommentOrder,
  },
  data: function () {
    return {
      location: window.location.origin,
      tabSelect: 0,
      pending: false,
      editor: {},
      valid: true,
      formDialogRight: false,
      alert: {
        show: false,
        option: {
          type: null,
          text: null,
        },
      },
      components: [
        {
          c: 'params-order',
          t: 'данные заказа',
        },
        {
          c: 'user-order',
          t: 'данные клиента',
        },
        {
          c: 'comment-order',
          t: 'комментарии',
        },
      ],
    }
  },
  mounted: function () {
    setTimeout(() => {
      this.$emit('update:edt', false)
    }, 100)
  },
  watch: {
    edit: function () {
      this.editor = this.edit
    },
    editor: {
      deep: true,
      handler: function () {
        this.$emit('update:edt', true)
      },
    },
    formDialog: function (a) {
      setTimeout(() => {
        this.formDialogRight = a
        html_hidden('editor')
      }, 10)
    },
    'alert.option': {
      deep: true,
      handler: function () {
        this.alert.show = true
      },
    },
  },
  computed: {
    activeItem: function () {
      return this.components[this.tabSelect]
    },
    alertColor: function () {
      switch (this.alert.option.type) {
        case 'loading':
          return 'blue darken-1'
        default:
          return this.alert.option.type
      }
    },
  },
  methods: {
    closeModal: function (e) {
      if (this.edt) {
        this.$root.confirmAction(e, {
          type: 'set_editor',
          action: () => {
            this.$emit('update:formDialog', false)
            this.$emit('update:selected', null)

            setTimeout(() => {
              this.$emit('update:edt', false)
            }, 100)
          },
        })
      } else {
        this.$emit('update:formDialog', false)
        this.$emit('update:alert', false)
      }
    },
    validate: function () {
      const comp = this.components.map((item) => {
        return this.$refs[item.c][0].validate()
      })

      return Promise.all(comp).then((values) => {
        for (let i = 0; i < values.length; ++i) {
          const item = values[i]

          if (!item.result) {
            this.tabSelect = item.index

            if (item.alert) {
              this.alert.show = true
              this.alert.option.type = 'warning'
              this.alert.option.text = item.alert
            }
            return false
          }
        }

        return true
      })
    },
    save: function () {
      this.validate().then((result) => {
        if (result) {
          this.pending = true
          const {
            id,
            delivery,
            payment,
            fullname,
            phone,
            email,
            status,
            pay,
            comment,
          } = this.editor

          axios
            .post(DATA.CRM.SERVICE.EDIT, {
              id,
              delivery,
              payment,
              fullname,
              phone,
              email,
              status,
              pay,
              comment,
            })
            .then((response) => {
              const data = response.data

              if (data.success) {
                this.$emit('updateList')

                setTimeout(() => {
                  this.$emit('update:selected', null)
                  this.$emit('update:formDialog', false)
                }, 500)
              } else {
                if (data.values.length) {
                  data.values.forEach((item) => {
                    this.editor[item.key] = item.value
                  })
                }
                if (data.message.length) {
                  this.alert.show = true
                  this.alert.option.type = 'error'
                  this.alert.option.text = data.message.join('<br>')
                }
              }
            })
            .catch(() => {
              this.alert.show = true
              this.alert.option.type = 'error'
              this.alert.option.text = 'Неизвестная ошибка, повторите попытку'
            })
            .finally(() => {
              this.pending = false
            })
        }
      })
    },
  },
}
</script>
