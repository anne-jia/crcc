import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const OrderService = {
    sendAudit(procKey) {
        return http.post('demo/submit', { procKey })
    }
}

export default OrderService