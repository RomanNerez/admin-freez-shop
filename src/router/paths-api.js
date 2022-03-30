const buildPath = (path) => `${process.env.VUE_APP_API_URL}/api${path}`

export const AUTH = {}
export const DATA = {
  LANG: buildPath('/get-lang'),
  SETTINGS: {
    OPTIONS: buildPath('/options'),
    OPTIONS_UPDATE: buildPath('/options/update'),
    CURRENCY: buildPath('/currency'),
    CURRENCY_CREATE: buildPath('/currency/create'),
    CURRENCY_EDIT: buildPath('/currency/edit'),
    CURRENCY_DELETE: buildPath('/currency/delete'),
    CURRENCY_UPDATE: buildPath('/currency/update'),
    MENU_GET: buildPath('/menu'),
    CATEGORIES_GET: buildPath('/store/category'),
    COLLECTIONS_GET: buildPath('/collection'),
    PAGES_GET: buildPath('/page'),
    MENU: {
      CREATE: buildPath('/menu/create'),
      DELETE: buildPath('/menu/delete'),
      UPDATE: buildPath('/menu/update'),
    },
    ARBITRARY_LINKS: {
      CREATE: buildPath('/arbitrary-links/create'),
      DELETE: buildPath('/arbitrary-links/edit'),
    },
    AREA_VISIBILITY: {
      ADD: buildPath('/menu-area-visibility/add'),
      DELETE: buildPath('/menu-area-visibility/delete'),
      EDIT: buildPath('/menu-area-visibility/edit'),
    },
  },
  STORE: {
    CATEGORIES: {
      COPY: buildPath('/store/category/copy'),
      DELETE: buildPath('/store/category/delete'),
      CREATE: buildPath('/store/category/create'),
      EDIT: buildPath('/store/category/edit'),
    },
    GROUPS: {
      GET: buildPath('/store/groups'),
    },
  },
}
