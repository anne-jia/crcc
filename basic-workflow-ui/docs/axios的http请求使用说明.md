## 增加特性说明
* 同一请求在1s内重复发送，会进行拒绝处理；
* 根据store的getters中是否有token设置，增加header中认证token的传递；
* 其会自动处理响应中的异常的信息；
* 对正常的响应，只返回其`response.data`信息；
* 在`Vue`、`Vue instance`、`window`对象上注册封装的`axios`实例，属性名为`axios`。
## 使用方式说明
直接使用`Vue`、`Vue instance`、`window`对象上的`axios`属性。
> 这里说明一点，不推荐直接使用`window`等DOM相关的对象

实例代码如下：
```javascript
import Vue from 'vue'

export function login(username, password, imageCode, maxSessionsPreventsLogin) {
  return Vue.axios({
    url: '/authentication/form',
    method: 'post',
    data: {
      username,
      password,
      imageCode,
      maxSessionsPreventsLogin,
    }
  })
}
```

详细的使用说明，请参考[axios官方文档](https://github.com/axios/axios)

