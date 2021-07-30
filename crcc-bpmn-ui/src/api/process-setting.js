//流程参与者设置

const processSetting = {
    /**
     * 
     * @param {*} JobName  岗位名称，
     * @returns 模糊查询前100个匹配的岗位，并构造成组织树形结构返回
     */
    jobsByName(JobName) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowmgr/jobsByName?JobName=${JobName}`,
            method: 'get',
        })
    },
    /**
     * 
     * @returns 流程定义中为获取岗位信息，获取顶级有权限的组织树数据
     */
    jobsTree() {
        return window.axios({
            url: `${window.CLIENT_URL}/flowmgr/jobsTree`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} parentId 流程定义中根据父组织的id
     * @returns 懒加载获取下级组织直到岗位的列表数据
     */
    jobsByParentId(id,name,type) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowmgr/jobsByParentId?parentId=${id}&parentPathName=${name}&parentType=${type}`,
            method: 'get',
        })
    },
    /**
     * 
     * @param {*} usersByName  用户姓名，
     * @returns 模糊查询前100个匹配的姓名，并构造成组织用户树形结构返回
     */
     usersByName(userName) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowmgr/usersByName?userName=${userName}`,
            method: 'post',
        })
    },
    /**
     * 
     * @returns 流程定义中为获取用户信息，获取顶级有权限的组织树数据
     */
     usersTree() {
        return window.axios({
            url: `${window.CLIENT_URL}/flowmgr/usersTree`,
            method: 'post',
        })
    },
    /**
     * 
     * @param {*} parentId 流程定义中根据父组织的id
     * @returns 懒加载获取下级组织直到用户的列表数据
     */
     usersByParentId(id,name,type) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowmgr/usersByParentId?parentId=${id}&parentPathName=${name}&parentType=${type}`,
            method: 'post',
        })
    },

}

export default processSetting