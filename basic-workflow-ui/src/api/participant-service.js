import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const ParticipantService = {
    loadCompanyTree(useAuth) {
        return http.get('flowmgr/companies', {
            params: { useAuth }
        });
    },

    loadJobHelpData(cond) {
        return http.post('flowmgr/jobs', cond)
    },

    getUserList: function getUserList(cond) {
        return http.post('flowmgr/users', cond);
    }
}

export default ParticipantService