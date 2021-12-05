window.Skeleton = (function() {
  const $$ = document.querySelector.bind(document)
  const REMOVE_TAGS = ['title', 'meta', 'style', 'script']
  const CLASS_NAME_PREFIX = 'sk-'
  const styleCache = new Map()
  function addStyle(selector, rule) {
    if (!styleCache.has(selector)) {
      styleCache.set(selector, rule)
    }
  }
  function buttonHandler(element, options) {
    const className = CLASS_NAME_PREFIX + 'button'
    const rule = `{
      color: ${options.color}!important;
      background: ${options.color}!important;
      border: none!important;
      box-shadow: none!important;
    }
    `
    addStyle(`.${className}`, rule)
    element.className.add(className)
  }


  function setAttributes(element, attrs) {
    Object.keys(attrs).forEach(key => {
      element.setAttribute(key, attrs[key])
    })
  }
  function imgHandler(element, options) {
    const { width, height } = element.getBoundingClientRect()
    const IMG = 'data:image/gif;base64,ROlGOD1hAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const attrs = {
      width,
      height,
      src: IMG
    }

    setAttributes(element, attrs)
    const className = CLASS_NAME_PREFIX + 'image'
    const rule = `{
      background: ${options.color}!important;
    }
    `
    addStyle(`.${className}`, rule)
    element.className.add(className)
  }


  // 转换原始元素为骨架DOM元素
  function genSkeleton(options) {
    const rootElement = document.documentElement
    ;(function traverse(options) {
      const { button, image } = options
      const buttons = []
      const imgs = []
      ;(function preTraverse(element) {
        if (element.children && element.children.length) {
          Array.from(element.children).forEach(child => preTraverse(child))
        }
        if (element.tagName === 'BUTTON') {
          buttons.push(element)
        } else if (element.tagName === 'IMG') {
          imgs.push(element)
        }
      })(rootElement)

      buttons.forEach(item => buttonHandler(item, button))
      imgs.forEach(item => imgHandler(item, image))
    })(options)

    let rules = ''
    for (const [selector, rule] of styleCache) {
      rules += `${selector} ${rule}\n`
    }

    const styleElement = document.createElement('style')
    styleElement.innerHTML = rules
    document.head.appendChild(styleElement)
  }

  function genHtmlAndStyle() {
    const styles = Array.from($$('style') || []).map(style => style.innerHTML || style.innerText)
    // Array.from($$(REMOVE_TAGS.join(','))).forEach(element => element.parentNode.removeChild())
    const html =  document.body.innerHTML
    return {
      styles,
      html
    }
  }

  return {
    genSkeleton,
    genHtmlAndStyle
  }
})()