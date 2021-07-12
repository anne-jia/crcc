import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const InstMgrService = {
    getProcTypes() {
        return http.get('instmgr/types')
    },

    loadProcInsts(typeId) {
        return http.get('instmgr/instances', {
            params: { typeId }
        })
    },

    deleteInst(instId) {
        return http.delete('instmgr/deleteInst', {
            params: { instId }
        })
    },

    getFreeNodes(instId) {
        return http.get('instmgr/freenodes', {
            params: { instId }
        })
    },

    jump(jumpInfo) {
        return http.post('freeflow/jump', jumpInfo)
    },

    running(instId) {
        return http.get('instmgr/running', {
            params: { instId }
        })
    },

    assign(assignInfo) {
        return http.post('freeflow/assign', assignInfo);
    },

    getAuths() {
        return http.get('instmgr/freeflowAllowed');
    }
}

export default InstMgrService;