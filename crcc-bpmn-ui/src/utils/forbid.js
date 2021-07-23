
function banBackSpace(e) {
  var ev = e || window.event
  // 各种浏览器下获取事件对象
  var obj = ev.relatedTarget || ev.srcElement || ev.target || ev.currentTarget
  // 按下Backspace键
  if (ev.keyCode == 8) {
    var tagName = obj.nodeName // 标签名称
    if (tagName == "BODY") {
      return stopIt(ev)
    }

  }
}
function stopIt(ev) {
  if (ev.preventDefault) {
    // preventDefault()方法阻止元素发生默认的行为
    ev.preventDefault()
  }
  if (ev.returnValue) {
    // IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
    ev.returnValue = false
  }
  return false
}
$(function() {
  // 实现对字符码的截获，keypress中屏蔽了这些功能按键
  document.onkeypress = banBackSpace
  // 对功能按键的获取
  document.onkeydown = banBackSpace
})
