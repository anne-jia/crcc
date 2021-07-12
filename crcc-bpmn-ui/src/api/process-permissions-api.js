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
    }
}

export default processPermissionsApi;