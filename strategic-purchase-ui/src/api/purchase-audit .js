const prodictAudit = {
  /**
   * 审核列表
   * @param
   * @returns
   */
   getPageInfo(data) {
    return window.axios({
      url: `${window.PURCHASE_MANAGE_URL}/framework/getPageInfo/page`,
      method: 'post',
      data: data
    })
  },
   // 获取弹出框表格数据
    getViewdDtails(data) {
      return window.axios({
        url: `${window.CLIENT_URL}/purchase/getPurchaseDetail/${data}`,
        method: 'post',
        data: data
      })
    },
}
export default prodictAudit
