export default function(Vue) {
  window.Vue = Vue

  Vue.prototype.reloginConfirm = function() {
    this.$confirm(
      '登录信息已失效，可以取消继续留在该页面，或者重新登录',
      '身份失效',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        zIndex: 5000
      }
    ).then(() => {
      window.IS_SHOW_SESSION_INVALID = false;
      window.location.reload()
    }).catch(() => {
      window.IS_SHOW_SESSION_INVALID = false;
    })
  }

  window.exceptionHandler = function(errorInfo) {
    // 不是业务异常时，判断是否是认证异常 "com.crcc.integration.auth.handler.CrccAuthenticationException"
    const authException = 'com.crcc.authentication.auth.handler.CrccAuthenticationException'
    const unauthorizedException = 'com.crcc.bootbase.api.authorization.exception.UnauthorizedException'
    if (authException == errorInfo['exception']) {
      if(!window.IS_SHOW_SESSION_INVALID){
        window.IS_SHOW_SESSION_INVALID = true;
        window.Vue.prototype.reloginConfirm();
      }
    } else if (unauthorizedException == errorInfo.exception) {
      if (errorInfo.message instanceof Array) {
        // 如果是获取菜单和主岗组织信息时抛出 UnauthorizedException 说明用户无系统访问权限,会路由到 401 页面，此时不跑出提示
        if (errorInfo.url && (errorInfo.url.indexOf('/getUserMenus') == -1 && errorInfo.url.indexOf('/getUserMainPosition') == -1)) {
          window.Vue.prototype.warn(errorInfo.message.join(';'))
        }
      }
    } else {
      window.Vue.prototype.error('出现内部错误，请及时联系维护人员')
    }
  }
}

