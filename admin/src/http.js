import axios from 'axios'
import Vue from 'vue'
const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api',
})
//在添加请求的时候，统一传递token
http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer ' + localStorage.token
    return config
  },
  (err) => {
      return Promise.reject(err)
  }
)
// http请求拦截器
http.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    // console.log(err.response)
    // 通用的错误处理
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message,
      })
    }
    return Promise.reject(err)
  }
)
export default http
