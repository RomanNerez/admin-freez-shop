const path = require('path')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@/': path.join(__dirname, 'src/'),
      },
    },
  },

  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      includeLocales: false,
      enableBridge: true,
    },
  },
}
