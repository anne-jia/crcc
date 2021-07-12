import { createAxios } from '@linto/basic-framework'

const http = createAxios({
    baseURL: window.CAMUNDA_URL
}, false, false);

const FlowTypeService = {
    loadTypes(page, size, cond) {
        return http.post('flowtype/getTypePage', {
            pageNum: page,
            pageSize: size,
            json: JSON.stringify(cond)
        })
    },

    deleteType(typeId) {
        return http.delete('flowtype/delete', {
            params: { typeId }
        })
    },

    isCodeUsed(type) {
        return http.post('flowtype/isCodeUsed', type)
    },

    isNameUsed(type) {
        return http.post('flowtype/isNameUsed', type);
    },

    saveType(type) {
        return http.post('flowtype/save', type)
    },

    loadCol(typeId) {
        return http.get('flowtype/columns', {
            params: { typeId }
        })
    },

    saveColInfo(column) {
        return http.post('flowtype/saveCol', column)
    },

    deleteCol(extendId) {
        return http.delete('flowtype/deleteCol', {
            params: { extendId }
        })
    },

    isColumnDuplicate(column) {
        return http.post('flowtype/isColumnDuplicate', column)
    }
}

export default FlowTypeService;