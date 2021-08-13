### 需要卸载得依赖
1.nprogress

### 需要删除得文件

1.src/components文件下 ：Hamburger，Breadcrumb，Headers，HeaderSearch，Pagination，RightPanel，SvgIcon，templateUI

2.src/permission.js



### 需要替换的同命文件夹/同名文件

1. src/layout
2.src/icons/index.js
3、src/utils/forbid.js
3、src/utils/message.js
4.src/utils/auth.js



### 删除的依赖：
vue-element-dialog-draggable
vuedraggable
vue-upload-component



### main.js删除的引入
import './permission' // permission control

import Pagination from '@/components/Pagination'
Vue.component('pagination', Pagination)

import draggable from 'vuedraggable'

Vue.component('draggable', draggable)


import VueUploadComponent from 'vue-upload-component'
Vue.component('file-upload', VueUploadComponent)