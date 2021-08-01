<template>
  <el-pagination
    class="pagination-container"
    :background="background"
    :pager-count="pagerCount"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-sizes="pageSizes"
    :page-size="limit"
    :layout="layout"
    :total="total"
  >
  </el-pagination>
</template>

<script>
import {scrollTo} from '@/utils/scroll-to'
export default {
  props: {
    background: {
      type: Boolean,
      default: true
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 500];
      }
    },
    pageSize: {
      type: Number,
      default: 20
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    total: {
      required: true,
      type: Number
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    scrollToElementClassName:{
      required: true,
        type:String,
        default:''
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed:{
      page:{
          get(){
              return this.currentPage;
          },
          set(val){
              this.$emit('update:currentPage',val)
          }
      },
      limit:{
        get(){
            return this.pageSize
          },
          set(val){
              this.$emit('update:pageSize' ,val)
          }
      }
  },
  methods: {
      handleSizeChange(val){
          this.$emit('pagination',{currentPage:1,pageSize:val})
           if(this.autoScroll){
            if(this.scrollToElementClassName){
              scrollTo(0,800,this.scrollToElementClassName)
            }
              scrollTo(0,800)
          }
      },
      handleCurrentChange(val){
        this.$emit('pagination',{currentPage:val,pageSize:this.pageSize})
        if(this.autoScroll){
            if(this.scrollToElementClassName){
              scrollTo(0,800,this.scrollToElementClassName)

            }
              scrollTo(0,800)

          }
      }
  },
};
</script>
