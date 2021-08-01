const authSubjectService = {
  /**
   * 查询授权主体列表数据
   * @param {*} authSubjectsPageParam
   */
  loadAuthSubjectPage(authSubjectsPageParam) {
    return window.axios({
      url: `${window.CLIENT_URL}/sysAuthSubject/loadAuthSubjectPage`,
      method: 'post',
      data: authSubjectsPageParam
    })
  },
  /**
   * 获取当前授权主体的已经授权的岗位/用户
   * @param authObjType 3.岗位 4.用户
   * @returns {AxiosPromise}
   */
  loadDefaultCheckNodes(defaultSubjectParam) {
    return window.axios({
      url: `${window.CLIENT_URL}/sysAuthSubject/loadDefaultCheckNodes`,
      method: 'post',
      data: defaultSubjectParam
    })
  },
  /**
   * 保存插入岗位数据
   * @param authSubjects
   */
  insertAuthSubjects(authSubjects) {
    return window.axios({
      url: `${window.CLIENT_URL}/sysAuthSubject/insert`,
      method: 'post',
      data: authSubjects
    })
  },
  /**
   * 删除授权主体
   * @param ids
   */
  deleteAuthSubjectsByIds(ids) {
    return window.axios({
      url: `${window.CLIENT_URL}/sysAuthSubject/delete`,
      method: 'delete',
      data: ids
    })
  },
  /**
   * 更新权限信息
   * @param data
   * @returns {AxiosPromise}
   */
  updatePermissionCode(data){
    return window.axios({
      url: `${window.CLIENT_URL}/sysAuthSubject/updatePermissionCode`,
      method: 'post',
      data: data
    })
  },

  /**
   * 获取所有授权编码数据
   * @param authSubjectsPageParam
   * @returns {AxiosPromise}
   */
  getAllPermissions() {
    return window.axios({
      url: `${window.CLIENT_URL}/permissionCode/getAllPermissions`,
      method: 'get'
    })
  },
  /**
   * 获取顶级有权限组织
   */
  getTopAuthOrgBySystem(){
    return window.axios({
      url: `${window.CLIENT_URL}/authOrg/getTopAuthOrgBySystem`,
      method: 'get'
    })
  }

}

export default authSubjectService
