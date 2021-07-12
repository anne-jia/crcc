import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const CompanyFlowService = {
    getCompanyTree() {
        return http.get('companyflow/getCompanyTree')
    },

    saveCompanyFlow(flow) {
        return http.post('companyflow/saveCmpFlow', flow)
    },

    removeFlow(companyFlowId) {
        return http.delete('companyflow/deleteFlow', {
            params: { companyFlowId }
        })
    },

    getCompanyFlowPage(page, size, cond) {
        return http.post('companyflow/getCompanyFlowPage', {
            pageNum: page,
            pageSize: size,
            json: JSON.stringify(cond)
        })
    },

    loadHelpFlows(page, size, cond) {
        return http.post('companyflow/loadHelpFlows', {
            pageNum: page,
            pageSize: size,
            json: JSON.stringify(cond)
        })
    }
}

export default CompanyFlowService;