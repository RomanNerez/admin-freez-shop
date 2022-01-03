export function iLang(lang, obj) {
  const content = {}
  lang.forEach((lang) => (content[lang.local] = obj))
  return content
}
