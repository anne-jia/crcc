const http = window.axios;
const ApiHelpService = {
    /**
    * tree获取物料分类列表
    * @param
    */
    getMatSortList(param) {
      return http({
        url:`${window.CLIENT_URL}/manger/purPlan/findMatCode?currentOrgCode=${param.manageOrgCode?param.manageOrgCode:''}&matSortId=${param.matSortId?param.matSortId:''}`,
        method:'get',
      })

    },
    /**
    * 获取物料列表
    * @param
    */
    getMaterialPage(params) {
      return http({
        url:`${window.CLIENT_URL}/manger/purPlan/getMatCodeList`,
        method:'post',
        data:params
      })

    },
  /**
   * 获取物料分类根节点
   */
  getRootNode() {
    return window.axios({
      url: `${window.CLIENT_URL}/material/getMatSortRootNode`,
      method: 'get'
    })
  },
  /**
   * 获取子节点数据
   * @param currentOrgId 选中的组织节点
   * @param matSortId 物料分类id
   * @return
   */
  getChlidMatSortNode(currentOrgId, matSortId) {
    return window.axios({
      url: `${window.CLIENT_URL}/material/getChlidMatSortNode/${currentOrgId}/${matSortId}`,
      method: 'get'
    })
  },
  /**
   * 加载未引入的物料编码数据
   * @param  queryPageParam
   */
  loadMatCodePage(queryPageParam) {
    return window.axios({
      url: `${window.CLIENT_URL}/material/loadMatCodePage`,
      method: 'post',
      data: queryPageParam
    })
  },

  /**
   * 过滤物料分类节点 ，前端渲染红色
   * @param {*} currentOrgId 选中工程的父节点code
   * @param {*} filterText 过滤条件
   */
  getMatSortPathByFilterText(currentOrgId, filterText) {
    return window.axios({
      url: `${window.CLIENT_URL}/material/getMatSortPathByFilterText`,
      method: 'get',
      params: {
        currentOrgId,
        filterText
      }
    })
  }

}

export default ApiHelpService



