import TaskProcessLog from './src'

TaskProcessLog.install = function (Vue) {
    Vue.component(TaskProcessLog.name, TaskProcessLog)
}

export default TaskProcessLog;