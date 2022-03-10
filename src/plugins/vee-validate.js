import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

extend('required', {
  message: 'Поле {_field_} обязательно!',
  ...required,
})

export const max = {
  validate(value, args) {
    return value.length <= args.length
  },
  params: ['length'],
}
