<i18n>
{
    "en": {
        "name": "Name",
        "email": "E-mail",
        "password": "Password",
        "sign-in": "Sign in",
        "sign-in-google": "Sign in with Google",
        "admin": "Admin Panel"
    }, 
    "ru": {
        "name": "Имя",
        "email": "Почта",
        "password": "Пароль",
        "sign-in": "Войти",
        "sign-in-google": "Войти с помощью Google",
        "admin-panel": "Панель администратора"
    }
}
</i18n>

<template>
  <v-layout align-center justify-center>
    <v-card class="elevation-0" width="500" max-width="500">
      <v-toolbar color="#221f1f" class="d-flex justify-center elevation-0">
        <v-toolbar-title>
          <img src="../assets/Header-logo.png" />
        </v-toolbar-title>
      </v-toolbar>
      <v-card-title class="text-uppercase justify-center">
        {{ $t('admin-panel') }}
      </v-card-title>
      <v-card-text class="pl-2">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            :label="$t('email')"
            outlined
            dense
            prepend-icon="mdi-account"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :label="$t('password')"
            prepend-icon="mdi-lock"
            outlined
            dense
            :type="passwordVisibility ? 'text' : 'password'"
            required
          >
            <template v-slot:append>
              <v-icon @click="passwordVisibility = !passwordVisibility">
                {{ passwordVisibility ? ' mdi-eye-off' : ' mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="flex-column">
        <v-btn block color="primary" outlined type="submit">
          {{ $t('sign-in') }}
        </v-btn>
        <v-btn outlined block class="ma-2 black--text">
          <img
            src="../assets/icon-google.svg"
            class="mr-3"
            width="28"
            height="28"
          />
          Войти с помощью Google
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [(v) => !!v || 'Name is required'],
    passwordVisibility: false,
  }),

  methods: {
    submit() {
      this.$refs.form.validate()
      console.log('test')
    },
  },
}
</script>
