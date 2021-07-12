import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const flowService = {
    getBizTypes() {
        return http.get('flowmgr/getBizTypes')
    },

    deployFlow(info) {
        return http.post('flowmgr/deploy', info)
    },

    setFlowState(flow) {
        return http.post('flowmgr/setState', flow)
    },

    getFlowXml(procDefId) {
        return http.get('flowmgr/getFlowXml', {
            params: { procDefId }
        })
    },

    checkProcKey(procKey) {
        return http.get('flowmgr/duplicateCheck', {
            params: { procKey }
        })
    },

    getFlowPage(page, size, condition) {
        return http.post('flowmgr/getFlowPage', {
            pageNum: page,
            pageSize: size,
            json: JSON.stringify(condition)
        })
    }
}

export default flowService;