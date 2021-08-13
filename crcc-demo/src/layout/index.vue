<template>
    <layout :userInfo="getUserInfo" :titleInfo="titleInfo">
      <!-- 不引用原始显示岗位，自定义就使用下面的插槽， -->
          <!-- <template  v-slot:header>
              ming
          </template> -->
          
           <router-view :key="key" />
    </layout>
</template>
<script>
import { mapGetters } from 'vuex'
import setting from '@/settings'
export default {
  data(){
    return{
      titleInfo:{
      logo:require('@/assets/images/logos.png'),
      title: setting.title,
      }
    }
  },
computed: {
    ...mapGetters([
      'name',
      'positions',
      'mainPosition',
      'permission_routes'
    ]),

    key() {
      return this.$route.path
    },
    /**
     * 岗位
     * 名字
     * 路由
     * 消息数量
     * 如果不想显示公司信息就position赋空值，或者不传
     */
    getUserInfo(){
        return{
          position:this.mainPosition.name,
          name:this.name,
          routes:[...this.permission_routes],
          msgNum:0,
        }
    }
  }
}
</script>