export default {
    methods:{
        /**
         * 
         * @param {Array} list  当前数组
         * @param {Number} page  当前页
         * @param {Number} size  页面的大小
         * @param {Number} options 设置OpactionName 操作类型的值,
         */
        addOptionName(list,page,size,options){
            let indexFist = size * (page-1)+1;
             list.forEach((item,index,arr )=> {
                        // 操作类型名称数据处理
                    for (let opitem of options) {
                        // 将对象中添加optionName的字段  操作类型名字
                        if (item.bizTypeOpCode == opitem.code) {
                            item = {
                                ...item,
                                ...{
                                    optionName: opitem.name
                                }
                            } 
                        }
                    }
                    item={ ...item,...{tableIndex : indexFist+index}}
                    arr[index]=item;
            })
        },
        
          //  动态增加表行的类名!用于设置样式
    tableRowClassName({
            row,
            rowIndex
        }) {
            if (rowIndex % 2 == 1) {
                return "single-row";
            } else if (rowIndex % 2 == 0) {
                return "even-row";
            }
            return "";
        },

    },
}