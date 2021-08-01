const showTips = Vue.directive('showTips', {
  // el {element} 当前元素
  componentUpdated(el, binding, vnode, oldVnode) {
    const elLink = el.children[0]

    const curStyle = window.getComputedStyle(el, '') // 获取当前元素的style
    const textSpan = document.createElement('span') // 创建一个容器来记录文字的width
    // 设置新容器的字体样式，确保与当前需要隐藏的样式相同
    textSpan.style.fontSize = curStyle.fontSize
    textSpan.style.fontWeight = curStyle.fontWeight
    textSpan.style.fontFamily = curStyle.fontFamily
    // 将容器插入body，如果不插入，offsetWidth为0
    document.body.appendChild(textSpan)

    // 设置新容器的文字
    textSpan.innerHTML = binding.value?.text ? binding.value.text : el.innerText
    // 如果字体元素大于当前元素，则需要隐藏
    var boxWidth = binding.value?.width ? binding.value.width : el.offsetWidth
    if (textSpan.offsetWidth > boxWidth) {
      // 给当前元素设置超出隐藏
      if (el.className === 'option-list') {
        el.style.cssText = `
          max-width:${boxWidth - 40}px
          `
      }
      elLink.style.overflow = 'hidden'
      elLink.style.textOverflow = 'ellipsis'
      elLink.style.whiteSpace = 'nowrap'
      // 鼠标移入
      el.onmouseenter = function(e) {
        // 创建浮层元素并设置样式
        const vcTooltipDom = document.createElement('div')
        vcTooltipDom.style.cssText = `
            max-width:260px;
            max-height: 400px;
            overflow: auto;
            position:absolute;
            top:${e.clientY - e.offsetY + 30}px;
            left:${e.clientX - e.offsetX - 10}px;
            background: rgb(255,249,201);
            color:#606266;
            border-radius:5px;
            padding:10px;
            display:inline-block;
            font-size:12px;
            z-index:19999;
            word-break: break-all;
          `
        // 设置id方便寻找
        vcTooltipDom.setAttribute('id', 'vc-tooltip')
        // 将浮层插入到body中
        document.body.appendChild(vcTooltipDom)
        // 浮层中的文字
        document.getElementById('vc-tooltip').innerHTML = el.innerText
      }
      // 鼠标移出
      el.onmouseleave = function() {
        // 找到浮层元素并移出
        const vcTooltipDom = document.getElementById('vc-tooltip')
        vcTooltipDom && document.body.removeChild(vcTooltipDom)
      }
    } else {
      if (el.className === 'option-list') {
        el.style.cssText = `
          max-width:${boxWidth - 40}px
          `
      }
      el.onmouseenter = function() {
      }
    }
    // 记得移除刚刚创建的记录文字的容器
    document.body.removeChild(textSpan)
  },
  // 指令与元素解绑时
  unbind() {
    // 找到浮层元素并移除
    const vcTooltipDom = document.getElementById('vc-tooltip')
    vcTooltipDom && document.body.removeChild(vcTooltipDom)
  }
})
export default showTips
