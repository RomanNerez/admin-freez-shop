<template>
  <div class="b-steps three">
    <div class="b-colum">
      <ValidationProvider v-slot="{ errors }" rules="required">
        <v-text-field
          v-model.trim="value.content[local].metaTitle"
          label="Meta Title"
          color="green"
          outlined
          :error-messages="errors"
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" rules="required">
        <v-textarea
          v-model.trim="value.content[local].metaDesc"
          label="Meta Description"
          height="272px"
          no-resize
          color="green"
          outlined
          :error-messages="errors"
        ></v-textarea>
      </ValidationProvider>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: { ValidationProvider },
  props: {
    local: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>
