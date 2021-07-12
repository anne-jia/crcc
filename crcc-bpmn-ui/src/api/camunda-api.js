
const camundaApi = {
    //定义流程
    depoyXmlDefinition(data) {
        return window.axios({
            url: `${window.CLIENT_URL}camunda/deploy/xml`,
            method: 'post',
            data
          })
    },
    //获取流程
    loadInstanceInfo(instanceId) {
        return window.axios({
            url: `${window.CLIENT_URL}camunda/view/instance?instanceId=${instanceId}`,
            method: 'get'
          })
    }
}

export default camundaApi