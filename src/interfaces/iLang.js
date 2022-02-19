const clone = (obj) => JSON.parse(JSON.stringify(obj))

export function iLang(lang, obj) {
  const content = {}
  lang.forEach((lang) => (content[lang.local] = clone(obj)))
  return content
}
