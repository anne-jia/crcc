import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const CamundaService = {
    depoyXmlDefinition(deployInfo) {
        return http.post('camunda/deploy/xml', deployInfo)
    },
    loadInstanceInfo(instanceId) {
        return http.get('camunda/view/instance', {
            params: { instanceId }
        })
    }
}

export default CamundaService