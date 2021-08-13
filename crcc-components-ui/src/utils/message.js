/**
 * 向Vue中增加info、error、warn方法， 依赖element-ui的$message
 */
 function message (Vue) {
  Vue.prototype.info = function(msg) {
    this.$message({
      showClose: true,
      message: msg,
      type: 'success'
    })
  }

  Vue.prototype.error = function(msg) {
    this.$message({
      showClose: true,
      message: msg,
      type: 'error'
    })
  }

  Vue.prototype.warn = function(msg) {
    // warn 时增加对提示信息的判断，内容信息必须大于一，才给出提示；（防止出现一个单字母 C）
    if (msg && msg.length > 1) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'warning'
      })
    }
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  message(window.Vue);
};
export default message