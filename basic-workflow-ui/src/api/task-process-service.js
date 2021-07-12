import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const TaskProcessService = {
    getTaskProcessor(taskId) {
        return http.get("tasks/processor", {
            params: { taskId }
        })
    },

    completeTask(taskInfo) {
        return http.post("usertask/complete", taskInfo)
    },

    loadFlowFiles(taskId) {
        return http.get("tasks/files", {
            params: { taskId }
        })
    },

    deleteFile(fileId) {
        return http.delete("tasks/deleteFile", {
            params: { fileId }
        })
    },

    getLogs(instId) {
        return http.get('tasks/logs', {
            params: { instId }
        })
    },

    loadTasks(typeId) {
        return http.get("tasklist/active", {
            params: { typeId }
        })
    },

    loadFlowTypes() {
        return http.get('tasklist/types')
    },

    loadFlowInstFiles(instId) {
        return http.get("tasks/instFiles", {
            params: { instId }
        })
    },
}

export default TaskProcessService;