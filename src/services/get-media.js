const getParamWindow = () => `
    width=${process.env.VUE_APP_FILEMANAGER_WIDTH || 1280},
    height=${process.env.VUE_APP_FILEMANAGER_HEIGTH || 700}
`

export function selectFile() {
  window.open(
    process.env.VUE_APP_FILEMANAGER_URL,
    process.env.VUE_APP_FILEMANAGER_TITLE || 'FileManager',
    getParamWindow()
  )
  return new Promise((resolve) => {
    window.SetUrl = (items) => {
      resolve(items.slice(0, 6))
    }
  })
}

export function setMedia(current, index, type) {
  selectFile().then((response) => {
    console.log(response)
    if (type !== -1) {
      const replace = type ? 0 : response.length

      current.splice(
        index,
        replace,
        ...response.map((item, index) => {
          return {
            id: index + +new Date(),
            source: item.url,
          }
        })
      )

      if (current.length > 6) {
        const delta = current.length - 6
        current.splice(-delta, delta)
      }
    } else {
      let source = response[0].url

      if (typeof index === 'number') {
        current.splice(index, 1, source)
      } else {
        current[index] = source
      }
    }
  })
}
