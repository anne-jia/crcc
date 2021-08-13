import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Vue from 'vue'

function createAxios() {
  // create an axios instance
  const service = axios.create({
    baseURL: window.BASE_URL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 10000 // request timeout
  })

  // request interceptor
  service.interceptors.request.use(
    config => {
      // do something before request is sent
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
      if (store.getters.token) {
        // let each request carry token
        config.headers['X-Token'] = getToken()
      }
      if (process.env.NODE_ENV === 'development') {
        // config.headers['Authorization'] = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJwb3NpdGlvbnNcIjpbe1wiY29kZVwiOlwiMVwiLFwibGF5ZXJcIjowLFwicHJvdmlkZXJJZFwiOlwiY3JjY1wiLFwiaXNMZWFmXCI6MCxcImlkXCI6XCIxXCJ9XSxcInByb3ZpZGVySWRcIjpcImhyXCIsXCJpZFwiOlwiMzIxOTEzXCIsXCJuYW1lXCI6XCLlhazlvaZcIixcInJvbGVzXCI6W1wiTUFUX0FVRElUXCIsXCJNQVRfQ09ERVwiLFwiTUFUX1NPUlRcIixcIk1BVF9QRVJNSVNTSU9OXCIsXCJWSUVXRVJcIl19IiwiZXhwIjoxNjUzMTIwMDYyfQ.A0m7EJ1snAfKChlv0rUda_fM36zzY1qn7xtSJ75JI67JDtOhnGSbXvk6eGfOwicXo5QTeac9FuJ7_o_sp3oOSbCjN_-a3L6eb_VxECS-p4y0KZtD6PIR_pTOxQB0QvP6MDDsDlg1ZWKu6UIJT0RsN7elZtRkwpiqjkIJ49bGge-hvrSWiN_cmRv23lFotVKBkMM2H4l0mBjuTKce6zMnF7-8zYDDrsY8GGFPKhdNwxhSeaw7LIoqG-NbsZJ8uHTqDgSMShFQk5AMG1YDrTkA3uZFqx2Xb1dp_gY5cmNd6osOCA_kK8rnxZLT5FW5BR1eOI7SsmoBudWZTIJ5aRqQ9Q'
        config.headers['Authorization'] =
          'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJwb3NpdGlvbnNcIjpbe1wiY29kZVwiOlwiMDAwMDEwMDAwMTAwMDI3NzcwMDE5OTAwMVwiLFwibmFtZVwiOlwi5LiT5Lia57uE566h55CG5bKX5L2NXCIsXCJsYXllclwiOjAsXCJzb3J0T3JkZXJcIjoxLFwiaXNMZWFmXCI6MCxcImlkXCI6XCIzMjE0OTZcIixcInR5cGVcIjozfSx7XCJjb2RlXCI6XCIwMDAwMTAwMDAxMDAwMjcwMDAwODc3MDAxOTkwMDFcIixcIm5hbWVcIjpcIuaLm-agh-Wyl1wiLFwibGF5ZXJcIjowLFwic29ydE9yZGVyXCI6MSxcImlzTGVhZlwiOjAsXCJpZFwiOlwiMzI1ODAyXCIsXCJ0eXBlXCI6M31dLFwicHJvdmlkZXJJZFwiOlwiaHJcIixcImlkXCI6XCIzMjE0OTdcIixcIm5hbWVcIjpcIui0vuePguePglwiLFwicm9sZXNcIjpbXCJTVVBQTElFUlwiLFwiTUFUX0NPREVcIixcIk1BVF9TT1JUXCIsXCJNQVRfUEVSTUlTU0lPTlwiLFwiVklFV0VSXCJdfSIsImV4cCI6MTg3NTY3MTY3NX0.Dps7KZy93cR1dam6vxDPHj4UVQWW0iKqXz-QuS5rEgh430qdKCzDcR55N0yu4hnXZ7oVqVRO5_l4DRe7YY3VznpmJMHmCI1wLtfFQVKx0k3xLijQScN_PPa1emw4UKd9WqcchvqMfH_kefohlbUYubI4GXm2Sr2f5mwKa-pySYfh_EI7Wzyhpfe-N_CXzs-j3sI3r468fcKcrxoUKovXNuo764jWO_6vlSzsy7Ct8gTDzb54qMGbksaKMA94Vbr-yGYisV1oPm5Kcvlx-fI_SOCWB4GlhCKdQCkzPtMGgdp6ocUp4fDDj4PwPmz-70gEes01R10tQw8Z3i7rsTRlng'
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      const res = response.data
      // if the custom code is not 20000, it is judged as an error.

      if (response.status >= 400) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.confirm(
            'You have been logged out, you can cancel to stay on this page, or log in again',
            'Confirm logout',
            {
              confirmButtonText: 'Re-Login',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    },
    error => {
      let responseData = {}
      if (typeof error.response.data === 'object') {
        responseData = error.response.data
      }
      if (typeof error.response.data === 'string') {
        console.error('此处异常信息为字符串，请检查处理')
        responseData = JSON.parse(error.response.data)
      }
      if (responseData && responseData.bizError) {
        const unauthorizedException =
          'com.crcc.bootbase.api.authorization.exception.UnauthorizedException'
        if (unauthorizedException == responseData.exception) {
          Vue.prototype.unauthorizedException = true
        } else {
          return Promise.reject(responseData)
        }
      }

      window.exceptionHandler(responseData)
    }
  )
  return service
}

const Plugin = {}

Plugin.install = function(Vue) {
  const service = createAxios()
  Vue.axios = service
  window.axios = service
}

Vue.use(Plugin)
