<template>
  <div class="b-steps three">
    <div class="b-colum">
      <v-text-field
        v-model.trim="value.content[local].metaTitle"
        label="Meta Title"
        color="green"
        outlined
        :error-messages="requiredErrors('metaTitle')"
      ></v-text-field>

      <v-textarea
        v-model.trim="content[local].metaDesc"
        label="Meta Description"
        height="272px"
        no-resize
        color="green"
        outlined
        :error-messages="requiredErrors('metaDesc')"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'local', 'status', 'langs', 'valid', 'select', 'tabSelect'],
  //   validations: function () {
  //     let value = {
  //         content: {},
  //       },
  //       // eslint-disable-next-line no-unused-vars
  //       isStatus = false

  //     for (let i = 0; i < this.langs.length; i++) {
  //       let local = this.langs[i].local
  //       if (this.value.status) {
  //         isStatus = true

  //         value.content[local] = {
  //           metaTitle: {
  //             required,
  //           },
  //           metaDesc: {
  //             required,
  //           },
  //         }
  //       } else {
  //         value.content[local] = {
  //           metaTitle: {},
  //           metaDesc: {},
  //         }
  //       }
  //     }
  //     return { value }
  //   },
  data() {
    return {
      input: {
        metaTitle: true,
        metaDesc: true,
      },
      content: {
        ru: {
          metaTitle: '',
          metaDesc: '',
        },
        ua: {
          metaTitle: '',
          metaDesc: '',
        },
      },
    }
  },
  mounted() {
    // for (var i = 0; i < this.langs.length; i++) {
    //   let local = this.langs[i].local
    //   this.content[local] = {
    //     metaTitle: 0,
    //     metaDesc: 0,
    //   }
    // }
  },
  watch: {
    local(newLocal, oldLocal) {
      for (let keyValue in this.value.content[oldLocal]) {
        if (keyValue in this.input) {
          if (
            !this.content[newLocal][keyValue] &&
            !this.value.content[newLocal][keyValue]
          ) {
            this.value.content[newLocal][keyValue] =
              this.value.content[oldLocal][keyValue]
          }
        }
      }
    },
  },
  methods: {
    addContent(key) {
      this.content[this.local][key] = 1
    },
    validate() {
      this.$v.value.$touch()

      for (let i = 0; i < this.langs.length; i++) {
        let local = this.langs[i].local

        if (this.value.status) {
          if (
            !this.$v.value.content[local].metaTitle.required ||
            !this.$v.value.content[local].metaDesc.required
          ) {
            this.$emit('update:tabSelect', 1)
            this.$emit('update:select', this.langs[i].id)
            return false
          }
        }
      }
      return true
    },
    requiredErrors() {
      const errors = []
      //   if (!this.$v.value.content[this.local][key].$dirty) return errors
      //   if (this.$v.value.content[this.local][key].required !== undefined) {
      //     !this.$v.value.content[this.local][key].required &&
      //       errors.push('Это поле обязательно!')
      //   }
      return errors
    },
  },
}
</script>
