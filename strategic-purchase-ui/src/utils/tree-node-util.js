/* istanbul ignore next */
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const ieVersion = Number(document.documentMode)

/* istanbul ignore next */
const camelCase = function(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function(element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100
        } catch (e) {
          return 1.0
        }
      default:
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null)
    }
  } catch (e) {
    return element.style[styleName]
  }
} : function(element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)

  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '')

    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
    } else {
      element.style[styleName] = value
    }
  }
}
/**
 *
 * @param {event} event
 * @param {string} className 树元素的类名
 * @param {string|Number} treeWidth  树的宽度
 * @param {sting} tooltipContent tooltip的填写内容
 * @param {Object} tooltip tooltip对象
 * @param {function} func  防抖函数
 */
export function showToolTip(event, className, treeWidth, tooltip, func) {
  const nodeChild = event.target.querySelector(className)
  const pares = nodeChild.parentNode
  const treeNodeContent = nodeChild.parentNode.parentNode
  // const treeNodeIcon =nodeChild.parentNode.parentNode.firstChild;
  const range = document.createRange()
  range.setStart(treeNodeContent, 0)
  range.setEnd(treeNodeContent, treeNodeContent.childNodes.length)
  const rangeWidth = range.getBoundingClientRect().width

  const treeNodeContentPadding = (parseInt(getStyle(treeNodeContent, 'paddingLeft'), 10) || 0) +
    (parseInt(getStyle(treeNodeContent, 'paddingRight'), 10) || 0)

  if ((rangeWidth + treeNodeContentPadding > treeWidth || $(pares).innerWidth() > $(nodeChild).width()) && tooltip) {
    // TODO 会引起整个 Tree 的重新渲染，需要优化
    tooltip.referenceElm = nodeChild
    // debugger
    tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
    tooltip.doDestroy()
    // debugger

    tooltip.setExpectedState(true)
    func(tooltip)
    return nodeChild.innerText || nodeChild.textContent
  }
}
/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
 export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

