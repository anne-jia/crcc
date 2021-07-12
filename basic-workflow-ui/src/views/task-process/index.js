import TaskProcessor from './src'

TaskProcessor.install = function (Vue) {
    Vue.component(TaskProcessor.name, TaskProcessor)
}

export default TaskProcessor;