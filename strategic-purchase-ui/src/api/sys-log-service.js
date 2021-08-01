const sysLogService = {



  // 系统日志
  getSysLog(data){
    return window.axios({
      url:`${window.CLIENT_URL}/standardAuthLog/getSysLog`,
      method:'post',
      data:data
    })
  },
  // 岗位变动日志
  getPositionLog(data){
    return window.axios({
      url:`${window.CLIENT_URL}/standardAuthLog/getPositionLog`,
      method:'post',
      data:data
    })
  },
  // 组织变动日志
  getOrgLog(data){
    return window.axios({
      url:`${window.CLIENT_URL}/standardAuthLog/getOrgLog`,
      method:'post',
      data:data
    })
  },


  // 系统日志的操作类型
  getOpType4SysLog(){
    return window.axios({
      url:`${window.CLIENT_URL}/standardAuthLog/getOpType4SysLog`,
      method:'get'
    })
  },
  // 系统岗位变动的操作类型
  getOpType4PostionLog(){
    return window.axios({
      url:`${window.CLIENT_URL}/standardAuthLog/getOpType4PositionLog`,
      method:'get'
    })
  },
  // 系统组织变动的操作类型
  getOpType4OrgLog(){

    return window.axios({
      url:`${window.CLIENT_URL}/standardAuthLog/getOpType4OrgLog`,
      method:'GET'
    })
  },

}

export default sysLogService
