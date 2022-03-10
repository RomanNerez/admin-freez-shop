export default function html_hidden(comp) {
  if (!window.overlay || (window.overlay && comp == window.overlay)) {
    var coef = document.documentElement.scrollHeight - window.innerHeight

    if (document.documentElement.classList.contains('_scroll_hidden')) {
      document.documentElement.classList.remove('_scroll_hidden')
      document.documentElement.style.marginRight = '0px'

      window.overlay = false
    } else {
      if (coef > 0) {
        var offset = window.innerWidth - document.documentElement.clientWidth

        document.documentElement.style.marginRight = offset + 'px'
      }
      document.documentElement.classList.add('_scroll_hidden')
      window.overlay = comp
    }
  }
}
