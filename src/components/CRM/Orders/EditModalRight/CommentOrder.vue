<template>
  <v-container class="pt-0">
    <v-row>
      <v-col class="pt-0">
        <v-textarea
          label="Комментарий менеджера"
          color="green"
          outlined
          rows="15"
          v-model="value.comment"
        ></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['value', 'tab-select', 'invalid', 'alert'],
  methods: {
    validate() {
      return {
        result: true,
        index: this.tabSelect,
      }
    },
  },
}
</script>
