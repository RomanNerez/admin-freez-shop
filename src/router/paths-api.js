const buildPath = (path) => `${process.env.VUE_APP_API_URL}/api${path}`

export const AUTH = {}
export const DATA = {
  LANG: buildPath('/get-lang'),
  SETTINGS: {
    OPTIONS: buildPath('/options'),
    OPTIONS_UPDATE: buildPath('/options/update'),
    CURRENCY: buildPath('/currency'),
  },
}
