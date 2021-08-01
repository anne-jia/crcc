const Prodictlog = {
// 获取分页数据
  getPagingData(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/pageInfo`,
      method: 'post',
      data: data
    })
  },
  // 查看详情
  // getPurchaseDetail(data) {
  //   return window.axios({
  //     url: `${window.CLIENT_URL}/purchase/getPurchaseDetail/${data}`,
  //     method: 'post',
  //     data: data
  //   })
  // },
  // 获取弹出框表格数据
  getViewdDtails(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/getPurchaseDetail/${data}`,
      method: 'post',
      data: data
    })
  },
  // 采购组织数据
  getAuthOrgName() {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/getAuthOrgName4User`,
      method: 'post'
    })
  },
  // 组织协议数据
  getPurProDict() {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/getPurProDict`,
      method: 'post'
    })
  },
  // 新增
  getInsert(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/insert`,
      method: 'post',
      data: data
    })
  },
  // 供应商数据
  getSupplier(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/querySupplierInfoPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}&filterText=${data.filterText}`,
      method: 'get'
    })
  },
  // 修改
  getUpdate(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/update`,
      method: 'post',
      data: data
    })
  },
  // 暂存
  getInsertTemporary(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/insertDraft`,
      method: 'post',
      data: data
    })
  },
  // 删除
  getDelete(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/deleteById/${data}`,
      method: 'DELETE',
      data: data
    })
  },
  // 审核通过
  auditPurchase(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/auditPurchase/${data}`,
      method: 'post',
      data: data
    })
  },
  // 审核驳回
  auditNoPurchase(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/auditNoPurchase/${data}`,
      method: 'post',
      data: data
    })
  },
  // 启用
  getEnablePurchase(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/enablePurchase/${data}`,
      method: 'post',
      data: data
    })
  },
  // 停用
  getDisablePurchase(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/disablePurchase/${data}`,
      method: 'post',
      data: data
    })
  },
  getQueryPurSubtypes() {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/queryPurSubtypes`,
      method: 'post'
    })
  },
  // 应用范围树
  child(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/authOrg/tree/hasAuthOrgs/child`,
      method: 'post',
      data: data

    })
  },
  // 管理单位下级节点
  getCurrentOrgInfo(orgId) {
    return window.axios({
      url: `${window.CLIENT_URL}/purchase/getCurrentEngOrgInfo/${orgId}`,
      method: 'get'
    })
  }

}
export default Prodictlog
