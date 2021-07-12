module.exports ={
   externals : {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'axios': 'axios',
        'clipboard': 'clipboard',
        'echarts': 'echarts',
        'js-cookie': 'Cookies',
        'nprogress': 'NProgress',
        'normalize.css': 'normalize.css',
        'element-ui': 'ELEMENT',
        'moment': 'moment',
        'fuse.js': 'Fuse',
        'sortablejs': 'Sortable',
        'vue-router': 'VueRouter',
        'vue-count-to': 'VueCountTo',
        'vue-splitpane': 'VueSplitpane',
        'vuedraggable': 'vuedraggable',
        'vue-upload-component': 'VueUploadComponent',
      },

      modelPath : {
        css: [
          '../../../common/css/driver.min.css',
          '../../../common/css/normalize.min.css',
          '../../../common/css/nprogress.min.css',
          "../../../common/css/elementUi.css"
        ],
        js: [
           "../../../common/js/vue.min.js", 
           "../../../common/js/vuex.min.js", 
           "../../../common/js/vue-count-to.min.js", 
           "../../../common/js/vue-router.min.js", 
           "../../../common/js/vue-split-pane.min.js", 
           "../../../common/js/vue-upload-component.min.js", 
           "../../../common/js/vuedraggable.min.js", 
           "../../../common/js/elementUi.min.js",
           "../../../common/js/Sortable.min.js",
           "../../../common/js/axios.min.js", 
           "../../../common/js/clipboard.min.js", 
           "../../../common/js/driver.min.js", 
           "../../../common/js/echarts.min.js", 
           "../../../common/js/fuse.min.js", 
           "../../../common/js/js.cookie.min.js", 
           "../../../common/js/moment.min.js", 
           "../../../common/js/nprogress.min.js", 
          
        ]
        
      }
      
}