<template>
  <v-dialog max-width="550">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on" x-large dark class="ml-8">
        <v-icon left> mdi-pencil </v-icon>
        Цены
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card class="dialog-wrap">
        <v-toolbar color="primary" dark>
          Массовое редактирование стоимости товаров
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="4" align-self="center">
              <span class="text-h6"><small>Направление</small></span>
            </v-col>
            <v-col cols="8" align-self="center">
              <v-select
                :items="[
                  {
                    val: -1,
                    name: 'Понижение',
                  },
                  {
                    val: 1,
                    name: 'Повышение',
                  },
                ]"
                item-value="val"
                item-text="name"
                color="green"
                label="Направление"
                solo
                hide-details
                v-model="actions.edit.price.direction"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" align-self="center">
              <span class="text-h6"><small>Оператор</small></span>
            </v-col>
            <v-col cols="8" align-self="center">
              <v-select
                :items="[
                  {
                    val: 'percent',
                    name: 'Проценты',
                  },
                  {
                    val: 'int',
                    name: 'Число',
                  },
                ]"
                item-value="val"
                item-text="name"
                color="green"
                label="Оператор"
                solo
                hide-details
                v-model="actions.edit.price.operator"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" align-self="center">
              <span class="text-h6"><small>Значение</small></span>
            </v-col>
            <v-col cols="8" align-self="center">
              <v-text-field
                type="number"
                color="green"
                label="Значение"
                solo
                hide-details
                v-model="actions.edit.price.value"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false"> Отмена </v-btn>

          <v-btn
            color="success"
            class="ma-0 ml-4"
            :loading="actions.edit.price.pending"
            :disabled="!checkEditPrice"
            @click="priceEdit(dialog)"
          >
            Применить
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      actions: {
        edit: {
          price: {
            direction: null,
            operator: null,
            value: null,
            pending: false,
          },
        },
      },
    }
  },
  computed: {
    checkEditPrice() {
      const actions = this.actions.edit.price
      return actions.direction && actions.operator && actions.value
    },
  },
  methods: {
    priceEdit(dialog) {
      this.actions.edit.price.pending = true
      const { direction, operator, value } = this.actions.edit.price

      axios
        .post(window.location.pathname + '/products/update-price', {
          ...{ direction, operator, value },
          category: this.selected.categories,
        })
        .then(() => {
          this.$root.reloadData += 1

          dialog.value = false

          this.actions.edit.price.direction = null
          this.actions.edit.price.operator = null
          this.actions.edit.price.value = null

          this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Успешно!',
            text: 'Данные успешно обновлены',
          })
        })
        .catch(() => {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Внимание!',
            text: 'Произошла ошибка, обновите страницу',
          })
        })
        .finally(() => {
          this.actions.edit.price.pending = false
        })
    },
  },
}
</script>
