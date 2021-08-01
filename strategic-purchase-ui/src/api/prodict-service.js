
const prodictAPI = {
  // 获取表单数据
  getPageInfo(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/proDict/getPageInfo`,
      method: 'post',
      data: data
    })
  },
  // 新增请求
  addProdict(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/proDict/insert`,
      method: 'post',
      data: data
    })
  },
  // 修改
  getupdate(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/proDict/update`,
      method: 'post',
      data: data
    })
  },
  // 启用
  getcall(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/proDict/enableProDict/${data}`,
      method: 'post',
      data: data
    })
  },
  // 停用
  stopdata(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/proDict/disableProDict/${data}`,
      method: 'post',
      data: data
    })
  },
  // 删除
  getDelete(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/proDict/deleteById/${data}`,
      method: 'delete',
      data: data
    })
  }
  // 提交审核

}

export default prodictAPI
