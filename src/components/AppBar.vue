<template>
  <v-app-bar absolute app color="transparent" flat fixed height="90">
    <v-app-bar-nav-icon
      @click.stop="updateDrawer(!getDrawer)"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>{{ getTitle }}</v-toolbar-title>

    <component
      v-for="component in metaComponents"
      :key="component"
      :is="component"
    ></component>

    <v-spacer></v-spacer>

    <v-select
      style="max-width: 80px"
      v-model="selectLang"
      :items="getLangs"
      hide-details
      item-value="local"
      item-text="local"
      label="Язык"
      color="green"
      solo
      dense
    ></v-select>
    <a :href="homeUrl" target="_blank" style="text-decoration: unset">
      <v-btn class="ml-2" min-width="0" text>
        <v-icon>mdi-home-export-outline</v-icon>
      </v-btn>
    </a>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn class="ml-2" min-width="0" text v-bind="attrs" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item v-on:click="logout">Выйти</v-list-item>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { createNamespacedHelpers, mapGetters, mapMutations } from 'vuex'
import PriceListButton from './PriceListButton.vue'
import PriceEditModal from './PriceEditModal.vue'
import SelectCategories from './SelectCategories.vue'

const { mapActions: mapActionsAuth } = createNamespacedHelpers('auth')
const { mapGetters: mapGettersLang, mapMutations: mapMutationsLang } =
  createNamespacedHelpers('lang')

export default {
  components: {
    PriceListButton,
    PriceEditModal,
    SelectCategories,
  },
  data() {
    return {
      homeUrl: process.env.VUE_APP_API_URL,
      drawer: null,
      title: '',
    }
  },
  computed: {
    ...mapGetters(['getDrawer', 'getTitle']),
    ...mapGettersLang(['getLangs', 'getSelectLocal']),
    metaComponents() {
      return this.$route.meta?.components || []
    },
    selectLang: {
      get() {
        return this.getSelectLocal
      },
      set(value) {
        this.updateSelectLocal(value)
      },
    },
  },
  methods: {
    ...mapMutations(['updateDrawer']),
    ...mapActionsAuth(['logoutUser']),
    ...mapMutationsLang(['updateSelectLocal']),
    logout: function () {
      this.logoutUser().then(() => this.$router.push({ name: 'Login' }))
    },
  },
}
</script>
