//代办任务
const procesTasksApi = {

/**
     * 
     * @param {*} taskId 
     * @returns 
     * 根据taskId获取任务审核需要的相关信息，包括审批意见是否必填、是否可以上传附件、后续可扭转路径、单据预览URL
     */
 getTaskProcessor(taskId) {
    return window.axios({
        url: `${window.CLIENT_URL}tasks/processor?taskId=${taskId}`,
        method: 'get',
    })
},
    /**
     * 
     * @param {*} taskInfo 
     * @returns 完成控制
     */
    completeTask(data) {
        return window.axios({
            url: `${window.CLIENT_URL}usertask/complete`,
            method: 'post',
            data
        })
    },


    /**
     * 
     * @param {*} taskId 
     * @returns 获取某一任务的附件信息列表
     */
    loadFlowFiles(taskId) {
        return window.axios({
            url: `${window.CLIENT_URL}tasks/files?taskId=${taskId}`,
            method: 'get',
        })
      
    },
    /**
     * 
     * @param {*} fileId 
     * @returns 根据附件Id，删除某一具体的附件，注意，并不会真正删除对应的文件
     */
    deleteFile(fileId) {
        return window.axios({
            url: `${window.CLIENT_URL}tasks/deleteFile?fileId=${fileId}`,
            method: 'DELETE',
        })
    },
    /**
     * 
     * @param {*} instId 
     * @returns 获取某一流程实例的审批日志信息
     */
    getLogs(instId) {
        return window.axios({
            url: `${window.CLIENT_URL}tasks/logs?instId=${instId}`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} typeId 
     * @returns 获取当前登录用户某一流程类型下的所有待办任务
     */
    loadTasks(typeId) {
        return window.axios({
            url: `${window.CLIENT_URL}tasklist/active?typeId=${typeId}`,
            method: 'get',
        })
    },
    /**
     * 
     * @returns 获取当前登录用户所有待办任务对应的流程类型信息（包括流程类型下当前的待办任务数量）
     *           以及该类型的业务扩展列数据，用来进行待办任务展示
     */
    loadFlowTypes() {
        return window.axios({
            url: `${window.CLIENT_URL}tasklist/types`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} instId 
     * @returns 获取某一流程实例的所有任务的附件信息
     */
    loadFlowInstFiles(instId) {
        return window.axios({
            url: `${window.CLIENT_URL}tasks/instFiles?instId=${instId}`,
            method: 'get',
        })
    },
}

export default procesTasksApi;