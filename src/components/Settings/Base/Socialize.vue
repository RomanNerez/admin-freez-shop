<template>
  <v-col cols="12" sm="7">
    <v-card>
      <v-card-title class="py-0 table-header__btn">
        <v-sheet
          style="
            position: relative;
            top: -24px;
            transition: 0.3s ease;
            z-index: 1;
          "
          class="pa-7 text-center green rounded b-user-info__square"
          elevation="5"
        >
          <v-icon class="theme--dark" style="font-size: 32px">
            mdi-account-network-outline
          </v-icon>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" v-on:click="addSocial"> mdi-plus </v-icon>
            </template>
            <span>Добавить соц. сеть</span>
          </v-tooltip>
        </v-sheet>
        <span class="mb-6 font-weight-regular user-info__title">
          Социальные сети
        </span>
      </v-card-title>

      <v-container
        class="px-8 pt-4 pb-5 content-page options-wrap"
        style="height: 292px"
      >
        <form action="#">
          <v-row v-for="(item, index) in socials" :key="index">
            <v-col sm="2">
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-btn
                    class="ma-0 pa-0 overflow-hidden set-media-item"
                    fab
                    elevation="4"
                    color="#FAFAFA"
                    v-on:click="setMedia(item, 'image', -1)"
                  >
                    <template v-if="item.image">
                      <v-img :src="item.image"></v-img>
                    </template>
                    <template v-else>
                      <v-sheet
                        class="d-flex align-center justify-center"
                        color="#FAFAFA"
                      >
                        <v-icon color="#BDBDBD" medium>
                          mdi-image-size-select-large
                        </v-icon>
                      </v-sheet>
                    </template>

                    <v-fade-transition>
                      <v-overlay
                        color="light-blue darken-1"
                        v-if="hover"
                        absolute
                      >
                        <v-icon medium> mdi-folder-multiple-image </v-icon>
                      </v-overlay>
                    </v-fade-transition>
                  </v-btn>
                </template>
              </v-hover>
            </v-col>
            <v-col sm="5">
              <v-text-field
                label="Название"
                color="green"
                outlined
                hide-details
                v-model="item.name"
              ></v-text-field>
            </v-col>
            <v-col sm="5">
              <v-text-field
                label="Ссылка"
                color="green"
                outlined
                hide-details
                v-model="item.link"
              ></v-text-field>
            </v-col>
          </v-row>
        </form>
      </v-container>
    </v-card>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('settings/options')

export default {
  name: 'Socialize',
  data: () => ({
    socials: [],
  }),
  computed: {
    ...mapGetters(['getOptions']),
  },
  mounted() {
    this.__initData()
  },
  methods: {
    __initData() {
      this.socials = this.getOptions?.socials ?? []
    },
    addSocial: function () {
      this.socials.push({
        image: '',
        name: '',
        link: '',
      })
    },
  },
}
</script>
