/**
 * 文件上传下载 API
 *  1. 上传模块分类获取附件约束信息
 *  2. 上传
 *  3. 下载    
 */
const filePrefix = 'file'
const fileApi = {

    /**
     * 获取附件约束信息：文件名， 格式， 大小
     * @param {*} code 约束信息编码, 每个模块的附件不同 
     * 身份证正反面图片: supIdCard
     */
     getAttachConfig(code) {
        return window.axios({
            url: `${window.CLIENT_URL}/${filePrefix}/getAttachConfig?code=${code}`,
            method: 'get'
        })
    },

    /**
     * 文件上传地址
     *  post请求, 需要提供附件 file 和 code(文件服务器地址) 参数
     * 身份证正反面: supIdCard
     * file: 要上传的附件, 和原生 el-upload组件的file一致
     * code: supIdCard
     * post请求
     */
    uploadFile() {
        return `${window.CLIENT_URL}/${filePrefix}/uploadFile`
    },

    /**
     * 文件下载
     * fileID: 上传回调返回结果
     * fileName: 上传回调返回的文件名
     * code: 和上传一致  supIdCard
     * method: get 请求
     * downLoadFileSrc + 三个参数
     */
    downLoadFileSrc() {
        return `${window.CLIENT_URL}/${filePrefix}/downLoadFile`;
    }
    
}

export default fileApi
