//流程权限 
const processPermissionsApi = {

    /**
     * 
     * @returns 获取顶级有权限的公司组织树
    */
 
    getCompanyTree() {
        return window.axios({
            url: `${window.CLIENT_URL}companyflow/getCompanyTree`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} id 根据父组织的id懒加载获取下级组织直到最末级单位的列表数据
     * @returns 
     */
    
     getCompanyListByParentId(id) {
        return window.axios({
            url: `${window.CLIENT_URL}companyflow/getCompanyListByParentId?parentId=${id}`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} data 
     * @returns 保存或修改公司和流程定义之间的关系
     */
    saveCompanyFlow(data) {
        return window.axios({
            url: `${window.CLIENT_URL}companyflow/saveCmpFlow`,
            method: 'post',
            data
        })
    },
    /**
     * 
     * @param {*} companyFlowId 
     * @returns 根据公司和流程定义关系ID删除该关系
     */
    removeFlow(companyFlowId) {
        return window.axios({
            url: `${window.CLIENT_URL}companyflow/deleteFlow?companyFlowId=${companyFlowId}`,
            method: 'delete',
        })
    },
    /**
     * 
     * @param {*} value 
     * @returns 根据条件（至少包含公司ID）分页获取公司和流程定义关系列表
     */
    getCompanyFlowPage(value) {
        let data ={pageNum:value.pageNum,pageSize:value.pageSize,json:JSON.stringify({"keyword":value.keyword,"companyId":value.companyId})}
        return window.axios({
            url: `${window.CLIENT_URL}companyflow/getCompanyFlowPage`,
            method: 'post',
            data
        })
    },
    /**
     * 
     * @param {*} value 
     * @returns 帮助条件使用，条件为{'exclusionId':'公司id'}，获取该公司还未引入的流程定义数据，用来新增流程定义和公司之间的关系
     */
    loadHelpFlows(value) {
        let data ={pageNum:value.pageNum,pageSize:value.pageSize,json:JSON.stringify({"keyword":value.keyword,'exclusionId':value.exclusionId})}
        return window.axios({
            url: `${window.CLIENT_URL}companyflow/loadHelpFlows`,
            method: 'post',
            data
        })
    },
    deleteTaskExternalParticipants(id) {
        return window.axios({
            url: `${window.CLIENT_URL}taskexternal/deleteTaskExternalParticipants?id=${id}`,
            method: 'delete',
        })
    },
    /**
     * 删除
     */
    deleteParticipants(processDefinitionKey,companyId,taskDefinitionKey) {
        return window.axios({
            url: `${window.CLIENT_URL}taskexternal/deleteParticipants?processDefinitionKey=${processDefinitionKey}&companyId=${companyId}&taskDefinitionKey=${taskDefinitionKey}`,
            method: 'delete',
        })
    },
    /**
     * 
     * @param {*} processDefinitionKey 基于流程定义key
     * @param {*} companyId 关联公司公司id
     * @param {*} taskDefinitionKey 任务key
     * @returns 基于流程定义key、任务key和公司id获取该公司在进行该任务时的参与者信息
     */
    getTaskExternalParticipants(processDefinitionKey,companyId,taskDefinitionKey) {
        return window.axios({
            url: `${window.CLIENT_URL}taskexternal/getTaskExternalParticipants?processDefinitionKey=${processDefinitionKey}&companyId=${companyId}&taskDefinitionKey=${taskDefinitionKey}`,
            method: 'get',
        })
    },
    /**
     * "companyId": "string",
        "id": "string",
        "lastModifier": "string",
        "lastModifyDate": "2021-07-21T03:06:19.771Z",
        "participants": "string",
        "processDefinitionId": "string",
        "processDefinitionKey": "string",
        "taskDefinitionKey": "string"
     */
saveTaskExternalParticipants(value) {
        let data ={...value, participants: JSON.stringify(value.participants)}
        return window.axios({
            url: `${window.CLIENT_URL}taskexternal/saveTaskExternalParticipants`,
            method: 'post',
            data
        })
    },
}

export default processPermissionsApi;