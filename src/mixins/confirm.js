import store from '@/store/index'

export default {
  methods: {
    __confirm(event, type, confirm, revoke) {
      store.commit('confirmModel/updateDataConfirm', {
        target: event,
        type,
        confirm: () => {
          confirm()
          store.commit('confirmModel/updateOpen', false)
        },
        revoke: revoke
          ? revoke
          : () => {
              store.commit('confirmModel/updateOpen', false)
            },
      })
    },
  },
}
