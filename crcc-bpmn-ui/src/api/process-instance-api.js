//流程实例
const processInstanceApi = {
    /**
     * 
     * @returns 返回流程类型列表
     */
    getProcTypes() {
        return window.axios({
            url: `${window.CLIENT_URL}/instmgr/types`,
            method: 'get',
        })
    },
  
    /**
     * 
     * @param {*} typeId ，流程类型id
     * @returns 流程实例详情列表
     */
    getInstancesPage(typeId) {
        return window.axios({
            url: `${window.CLIENT_URL}/instmgr/instances?typeId=${typeId}`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} instId 实例id
     * @returns 挂起instId对应的流程实例
     */
    deleteInst(instId) {
        return window.axios({
            url: `${window.CLIENT_URL}/instmgr/deleteInst?instId=${instId}`,
            method: 'delete',
        })
    },
    /**
     * 
     * @param {*} instId 
     * @returns  获取当前流程实例ID，可以跳转到的任务id和name列表
     */
    getFreeNodes(instId) {
        return window.axios({
            url: `${window.CLIENT_URL}/instmgr/freenodes?instId=${instId}`,
            method: 'get',
        })
    },
    
    /**
     * 
     * @param {*} data 
     * @returns 自由流跳转
     */
    jump(data) {
        return window.axios({
            url: `${window.CLIENT_URL}/freeflow/jump`,
            method: 'post',
            data
        })
    },
    /**
     * 
     * @param {*} instId 
     * @returns 根据流程实例ID，获取当前实例正在执行的任务列表
     */
    running(instId) {
        return window.axios({
            url: `${window.CLIENT_URL}/instmgr/running?instId=${instId}`,
            method: 'get',
        })
     
    },
    /**
     * 
     * @param {*} data 自由流指派指派给指定的人
     * @returns 
     */
    assign(data) {
        return window.axios({
            url: `${window.CLIENT_URL}/freeflow/assign`,
            method: 'post',
            data
        })
    },
    /**
     *
     * @returns 获取当前登录用户是否拥有自由流的权限
     */
    getAuths() {
        return window.axios({
            url: `${window.CLIENT_URL}/instmgr/freeflowAllowed`,
            method: 'get',
        })
     
    },
}

export default processInstanceApi