<template>
  <v-text-field
    :label="holder"
    :value="value"
    color="green"
    outlined
    class="mb-0"
    v-on:input="$emit('input', $event)"
    hide-details
  ></v-text-field>
</template>

<script>
export default {
  props: ['value', 'holder', 'target', 'prop'],
}
</script>
