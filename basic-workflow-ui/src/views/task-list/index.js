import TaskList from "./src/index.vue"

TaskList.install = function (Vue) {
    Vue.component(TaskList.name, TaskList)
}

export default TaskList