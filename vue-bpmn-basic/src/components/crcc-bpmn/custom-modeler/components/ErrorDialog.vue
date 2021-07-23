<template>
    <dialog v-show="showDialog" ref="dialog" open style="position: absolute; cursor: pointer;" @close='close'>
        <div class="dialog__header clearfix" ref="header">
            <span class="title">错误</span>
            <el-button class="opaction" @click="close">关闭</el-button>
        </div>
        <div class="dialog_container scrollBar">
            <div class="row-header">
                <div class="message">信息 </div>
                <div class="element">元素</div>
            </div>
            <div class="row-body">
                <div v-for="(item,index) in errorList" :key="index" class="row-cell">
                    <div class="message"> {{item.message}}</div>
                    <div class="element">{{item.element}} </div>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script>
export default {
    name: "ErrorDialog",

    data() {
        return {
            errorList: [],
            showDialog: false
        };
    },

    methods: {
        showErrors(errors) {
            this.errorList = errors;
            this.showDialog = true;
        },
        close(){
          this.showDialog =false;
        },
        mouseDown() {
              let dialogHeaderEl = this.$refs.header,
                dragDom = this.$refs.dialog;
              const getStyle = (function () {
                  if (window.document.currentStyle) {
                      return (dom, attr) => dom.currentStyle[attr]
                  } else {
                      return (dom, attr) => getComputedStyle(dom, false)[attr]
                  }
              })()

            dialogHeaderEl.onmousedown = (e) => {
                //鼠标按下，计算鼠标触点距离元素左侧的距离
                const disX = e.clientX - dialogHeaderEl.offsetLeft
                const disY = e.clientY - dialogHeaderEl.offsetTop

                const dragDomWidth = dragDom.offsetWidth
                const dragDomHeight = dragDom.offsetHeight

                const screenWidth = document.body.clientWidth
                const screenHeight = document.body.clientHeight
                const minDragDomLeft = dragDom.offsetLeft
                const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

                const minDragDomTop = dragDom.offsetTop
                const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight
                // 获取到的值带px 正则匹配替换
                let styL = getStyle(dragDom, 'left')
                let styT = getStyle(dragDom, 'top')
                if (styL.includes('%')) {
                    styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
                    styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
                } else {
                    styL = +styL.replace(/\px/g, '')
                    styT = +styT.replace(/\px/g, '')
                }

                document.onmousemove = function (e) {

                    // 通过事件委托，计算移动的距离
                    let left = e.clientX - disX
                    let top = e.clientY - disY

                    // 边界处理
                    if (-(left) > minDragDomLeft) {
                        left = -minDragDomLeft
                    } else if (left > maxDragDomLeft) {
                        left = maxDragDomLeft
                    }

                    if (-(top) > minDragDomTop) {
                        top = -minDragDomTop
                    } else if (top > maxDragDomTop) {
                        top = maxDragDomTop
                    }

                    // 移动当前元素
                    dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

                };
                //鼠标松开时，注销鼠标事件，停止元素拖拽。
                document.onmouseup = function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }

        },
        
    },
    mounted() {
        this.mouseDown();
    },
};
</script>

<style lang="scss" scoped>
dialog {
    border: none;
    z-index: 9999999;
    width: 580px;
    height: 400px;
    box-sizing: border-box;
    box-shadow: 0 0 15px #757474;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    box-sizing: border-box;
  .dialog__header{
    padding: 0px 0px 8px;
    line-height: 25px;
    color: #656262;
    .title{
       float: left;

    }
    .opaction{
      float: right;
    }
  }
  .dialog_container{
    flex:1;
    overflow-y:scroll ;
    padding: 0px 0px 8px;
  }
    .row-header,
    .row-body {
        display: flex;
        justify-content: flex-start;
        box-sizing: border-box;

        .message {
            flex: 1;
            border-top: 1px solid #dfe6ec;
            border-right: 1px solid #dfe6ec;
            border-left: 1px solid #dfe6ec;
            padding: 0px 8px;
        }

        .element {
            width: 220px;
            padding: 0px 8px;
            border-top: 1px solid #dfe6ec;
            border-right: 1px solid #dfe6ec;
        }
    }

    .row-header {

        .message,
        .element {
            line-height: 36px;
            box-sizing: border-box;
            background: #f5f6f8;
            text-align: center;
        }
    }

    .row-body {
        flex-direction: column;
        border-bottom: 1px solid #dfe6ec;

        .row-cell {
            flex: 1;
            display: flex;
            justify-content: flex-start;

            &:nth-child(even) {
                background: rgba(221, 227, 230, 0.4);
            }

            &:hover {
                background: rgba(204, 207, 209, 0.5);
            }
        }

        .message,
        .element {
            line-height: 28px;
            box-sizing: border-box;
        }
    }
}
</style>
