//类型定义
const processTypesApi = {

    /**
     * 获取流程类型 查询||初始加载
     *  pageNum: page,
     *  pageSize: size,
     *  json: JSON.stringify(cond)
     * 
     * @returns 
     */
    getTypePage(value) {
        let data ={pageNum:value.pageNum,pageSize:value.pageSize,json:JSON.stringify({"keyword":value.keyword})}
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/getTypePage`,
            method: 'post',
            data
        })
    },

    /**
     * 
     * @param {*} typeId 选中行id
     * 流程类的扩展列的内容
     * @returns 
     */
    getColumns(typeId) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/columns?typeId=${typeId}`,
            method: 'get',
        })
    },
    //验证编号是否已经被使用
   /**
    * data{
    *   bizPage: "发发发"
    *   columns: []
    *   id: "524736055862099968"
    *   isSysDef: "0"
    *   lastModifier: "宫正"
    *   lastModifyTime: "2021-06-28 13:00:00"
    *   typeCode: "1112"
    *   typeName: "大大方方"
    * }
    * @param {*} data 
    * @returns 
    */
    isCodeUsed(data) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/isCodeUsed`,
            method: 'post',
            data,
        })
    },

    //验证名称是否已经被使用
    //参数同 isCodeUsed
    isNameUsed(data) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/isNameUsed`,
            method: 'post',
            data,
        })
    },

    //保存基本类型 ，修改|| 新增
    saveType(data) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/save`,
            method: 'post',
            data,
        })
    },
    /**
     * 删除流程类型
     * @param {*} typeId 流程类型的id
     * @returns 
     */
    deleteType(typeId) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/delete?typeId=${typeId}`,
            method: 'delete',
        })
    },
    /**
     * 
     * @param {*} data 
     *  value 判断标识是否重复"\"field\":\"002\""
     * value 判断名称是否重复 `"label":"${value}"`
     * @returns 
     */
    isColumnDuplicate(data) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/isColumnDuplicate`,
            method: 'post',
            data
        })
    },
     /**
      * 保存新增列||修改列
      * flowTypeId: "524736055862099968"
      *taskColInfo: "{\"field\":\"002\",\"label\":\"基本02\",\"width\":\"150\",\"order\":\"1\",\"align\":\"left\"}"
      * @param {*} column 
      * @returns 
      */
    saveColInfo(value) {
        let taskColInfo =JSON.stringify(value) 
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/saveCol`,
            method: 'post',
            data: {
                id:value.id,
                flowTypeId:value.flowTypeId,
                taskColInfo: taskColInfo,
            }
        })
    },
    /**
     * 标识列的删除
     * @param {*} extendId 当前行的id
     * @returns 
     */
    deleteCol(extendId) {
        return window.axios({
            url: `${window.CLIENT_URL}/flowtype/deleteCol?extendId=${extendId}`,
            method: 'delete',
        })
    },

}
export default processTypesApi