const frameworkAPI = {
  // 获取表单数据
  getManageInfo(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/getPageInfo`,
      method: 'post',
      data: data
    })
  },
  // 获取弹出框表格数据
  getViewdDtails(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/getFrameworkDetils/${data}`,
      method: 'post',
      data: data
    })
  },
  // 启用数据
  enableFramework(id) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/enableFramework/${id}`,
      method: 'post'
    })
  },
  // 停用数据
  disableFramework(id) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/disableFramework/${id}`,
      method: 'post'
    })
  },

  /**
  * 删除数据
  */
  deleteById(id) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/deleteById/${id}`,
      method: 'delete'
    })
  },
  /**
   * 审核通过接口
   */
  auditFramework(id) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/auditFramework/${id}`,
      method: 'post'
    })
  },
  /**
   * 审核不通过
   */
  auditNoFramework(id) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/auditNoFramework/${id}`,
      method: 'post'
    })
  },
  // 查询组织接口
  getAuthOrgName4User() {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/getAuthOrgName4User`,
      method: 'post'
    })
  },
  // purchase/queryAuditStatus
  //获取审核类型
  queryAuditStatus() {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/queryAuditStatus`,
      method: 'post'
    })
  },

  // 查询框架协议接口
  getPurProDict() {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/getPurProDict`,
      method: 'post'
    })
  },
  // 供应商数据
  querySupplierInfoPage(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/querySupplierInfoPage?pageNum=${data.pageNum}&pageSize=${data.pageSize}&filterText=${data.filterText}`,
      method: 'get'
    })
  },
  // 添加接口
  insert(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/insert`,
      method: 'post',
      data: data
    })
  },
  // 暂存
  getInsertTemporary(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/insertDraft`,
      method: 'post',
      data: data
    })
  },
  // 修改接口
  update(data) {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/update`,
      method: 'post',
      data: data
    })
  },
  getQueryPurSubtypes() {
    return window.axios({
      url: `${window.CLIENT_URL}/framework/queryPurSubtypes`,
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
      url: `${window.CLIENT_URL}/framework/getCurrentEngOrgInfo/${orgId}`,
      method: 'get'
    })
  }
}

export default frameworkAPI
