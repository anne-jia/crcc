
const showPopver = {
  // el {element} 当前元素
  bind(el, binding, vnode) {
    const vcTooltipDom = document.createElement('div')
    vcTooltipDom.style.cssText = `
        max-width:260px;
        max-height: 400px;
        overflow: auto;
        position:absolute;
        background: rgb(255,249,201);
        color:#606266;
        border-radius:5px;
        padding:10px;
        font-size:12px;
        z-index:19999;
        white-space: normal;
        word-break: break-word;
        display:none

      `
    // 设置id方便寻找
    vcTooltipDom.setAttribute('id', 'vc-tooltip')
    el.onmouseenter = function(e) {
      const textValue = binding.value.text
      // 浮层中的文字
      vcTooltipDom.style.cssText += `
      top:${e.clientY - e.offsetY + 30}px;
      left:${e.clientX - e.offsetX - 10}px;
    `

      if (!textValue) {
        vcTooltipDom.style.display = 'none'
      } else {
        vcTooltipDom.style.display = 'inline-block'
      }

      document.body.appendChild(vcTooltipDom)
      // 将浮层插入到body中
      document.getElementById('vc-tooltip').innerHTML = textValue
    }
    // 鼠标移出
    el.onmouseleave = function() {
      // 找到浮层元素并移出
      const vcTooltipDom = document.getElementById('vc-tooltip')
      vcTooltipDom && document.body.removeChild(vcTooltipDom)
    }
  },
  componentUpdated(el, binding, vnode) {
    // 创建浮层元素并设置样式
    const vcTooltipDom = document.createElement('div')
    vcTooltipDom.style.cssText = `
          max-width:260px;
          max-height: 400px;
          overflow: auto;
          position:absolute;
          background: rgb(255,249,201);
          color:#606266;
          border-radius:5px;
          padding:10px;
          font-size:12px;
          z-index:19999;
          white-space: normal;
          word-break: break-word;
          display:none
        `
    // 设置id方便寻找
    vcTooltipDom.setAttribute('id', 'vc-tooltip')
    el.onmouseenter = function(e) {
      const textValue = binding.value.text
      // 浮层中的文字
      vcTooltipDom.style.cssText += `
          top:${e.clientY - e.offsetY + 30}px;
          left:${e.clientX - e.offsetX - 10}px;
        `

      if (!textValue) {
        vcTooltipDom.style.display = 'none'
      } else {
        vcTooltipDom.style.display = 'inline-block'
      }

      document.body.appendChild(vcTooltipDom)
      // 将浮层插入到body中
      document.getElementById('vc-tooltip').innerHTML = textValue
    }
    if (vnode.child.focused) {
      const getTooltipDom = document.getElementById('vc-tooltip')
      if (binding.value.text && getTooltipDom) {
        getTooltipDom.innerHTML = binding.value.text
        getTooltipDom.style.cssText += `display:inline-block;`
      } else if (getTooltipDom) {
        getTooltipDom.innerHTML = ''
        getTooltipDom.style.cssText += `display:none`
      }
    }
    // 鼠标移出
    el.onmouseleave = function() {
      // 找到浮层元素并移出
      const vcTooltipDom = document.getElementById('vc-tooltip')
      vcTooltipDom && document.body.removeChild(vcTooltipDom)
    }
  },
  // 指令与元素解绑时
  unbind() {
    // 找到浮层元素并移除
    const vcTooltipDom = document.getElementById('vc-tooltip')
    vcTooltipDom && document.body.removeChild(vcTooltipDom)
  }
}

const install = function(Vue) {
  Vue.directive('showPopver',showPopver )
}

if (window.Vue) {
  window.showPopver = showPopver
  Vue.use(install); // eslint-disable-line
}

showPopver.install = install
export default showPopver
