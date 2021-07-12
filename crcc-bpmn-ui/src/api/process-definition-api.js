//流程定义

const processDefinitionApi = {
   //获取流程类型
    getBizTypes() {
        return window.axios({
            url: `${window.CLIENT_URL}flowmgr/getBizTypes`,
            method: 'get',
        })
    },
    //部署流程
    deployFlow(data) {
        return window.axios({
            url: `${window.CLIENT_URL}flowmgr/deploy`,
            method: 'post',
            data
        })
    },
    //设置流程的状态
    setFlowState(data) {
        return window.axios({
            url: `${window.CLIENT_URL}flowmgr/setState`,
            method: 'post',
            data
        })
    },
    //获取流程图
    getFlowXml(procDefId) {
        return window.axios({
            url: `${window.CLIENT_URL}flowmgr/getFlowXml?procDefId=${procDefId}`,
            method: 'get',
        })
       
    },
    // 查重流程定义标识
    checkProcKey(procKey) {
        return window.axios({
            url: `${window.CLIENT_URL}flowmgr/duplicateCheck?procKey=${procKey}`,
            method: 'get',
        })
    },
    //获取定义流程列表
    getFlowPage(value) {
        let data ={pageNum:value.pageNum,pageSize:value.pageSize,json:JSON.stringify({"keyword":value.keyword,"typeId":value.typeId})}
        return window.axios({
            url: `${window.CLIENT_URL}flowmgr/getFlowPage`,
            method: 'post',
            data
        })
    }
}

export default processDefinitionApi;