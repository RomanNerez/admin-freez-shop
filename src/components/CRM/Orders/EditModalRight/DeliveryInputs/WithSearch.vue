<template>
  <autocomplete
    ref="autocomplete"
    :search.sync="search"
    :placeholder="holder"
    :aria-label="holder"
    :get-result-value="resultSearch"
    :debounce-time="250"
    class="custom-autocomplete-delivery"
    :default-value="getDefault"
    @submit="setValue"
    @blur="setValue(null)"
  ></autocomplete>
</template>

<script>
import axios from 'axios'
import Autocomplete from '@trevoreyre/autocomplete-vue'

export default {
  props: [
    'value',
    'alt-value',
    'holder',
    'cls',
    'target',
    'prop',
    'api',
    'default-value',
    'alt-key',
    'alert',
  ],
  components: {
    Autocomplete,
  },
  data: function () {
    return {
      query: '',
      result: [],
    }
  },
  computed: {
    getCountry: function () {
      const data = this.prop.filter((item) => {
        return !this.query
          ? true
          : item.val
              .toLocaleLowerCase()
              .indexOf(this.query.toLocaleLowerCase()) !== -1
      })

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.result = data.length
        ? data
        : [
            {
              no_result: true,
              val: this.__('Нет совпадений...'),
            },
          ]

      return this.result
    },
    getDefault: function () {
      return this.defaultValue ?? null
    },
  },
  methods: {
    search(input) {
      this.query = input

      switch (this.target) {
        case 'country':
          return this.getCountry
        case 'locality':
          return this.requestData(this.target)
        case 'branch':
        case 'address':
          // eslint-disable-next-line no-case-declarations
          let target = this.target

          if (this.api) {
            target += '/' + this.api
          }
          return this.requestData(target, this.prop.code)
        default:
          return []
      }
    },
    requestData(endpoint, request = null) {
      return new Promise((resolve) => {
        if (this.query.length < 1) {
          return resolve([])
        }
        axios
          .get(this._locale('home/search-data/' + endpoint), {
            params: {
              query: this.query,
              request: request,
            },
          })
          .then((response) => {
            if (this.query) {
              let data = response.data

              this.result = data.length
                ? data
                : [
                    {
                      no_result: true,
                      val: this.__('Нет совпадений...'),
                    },
                  ]
            } else {
              this.result = []
            }
            resolve(this.result)
          })
          .catch(() => {
            resolve([
              {
                no_result: true,
                val: 'Произошла ошибка...',
              },
            ])
          })
      })
    },
    resultSearch(result) {
      return result.val
    },
    setValue(result) {
      if (result) {
        this.query = result.val
        this.result = [result]
      } else {
        if (this.result.length && !this.result[0].no_result) {
          const defaultResult = this.result[0]

          this.query = defaultResult.val
          this.result = [defaultResult]
        } else {
          this.query = ''
          this.result = []
        }
        this.$refs.autocomplete.setValue(
          this.result.length ? this.result[0] : null
        )
      }

      this.$emit('input', this.query)

      if (this.result.length) {
        this.$emit(
          'update:alt-value',
          this.altKey ? this.result[0][this.altKey] : this.result[0]
        )
      } else {
        this.$emit('update:alt-value', null)
      }
    },
  },
}
</script>
