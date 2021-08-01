const framworkAudit = {
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
  
}

export default framworkAudit
