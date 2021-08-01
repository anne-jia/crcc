<template>
<transition name="viewer-fade">
<div tabindex="-1"  class="el-image-viewer__wrapper" style="z-index: 2000;" >
    <div class="el-image-viewer__mask"></div>
    <span class="el-image-viewer__btn el-image-viewer__close" @click="closeImage">
        <i class="el-icon-circle-close"></i>
    </span>
    <!---->
    <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
            <i class="el-icon-zoom-out" @click="viewReduc"></i>
            <i class="el-icon-zoom-in" @click="viewBig"></i>
            <!-- <i class="el-image-viewer__actions__divider"></i> -->
            <i class="el-icon-full-screen" @click="init"></i>
            <i class="el-icon-download" v-if="showDowload" @click="downLoad"></i>
            <i class="el-icon-refresh-left" @click="antiClockWise"></i>
            <i class="el-icon-refresh-right" @click="clockWise"></i>
        </div>
    </div>
    <div class="el-image-viewer__canvas">
        <img :src="imgView" class="el-image-viewer__img" 
        style="margin-left: 0px; margin-top: 0px; max-height: 100%; max-width: 100%;"
        :style="imgStyle"
        @mousedown="handleMouseDown"
        >
    </div>
</div>
</transition>
</template>
<script>
import { rafThrottle, isFirefox,on,off } from '@/utils/brower';
const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
};
const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';

export default {
    data(){
        return{
        scaleNum:1,
        rotateNum:0,
        transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
        }
    },
    computed:{
    imgStyle() {
        const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
        const style = {
            transform: `scale(${scale}) rotate(${deg}deg)`,
            transition: enableTransition ? 'transform .3s' : '',
            'margin-left': `${offsetX}px`,
            'margin-top': `${offsetY}px`
        };
        if (this.mode === Mode.CONTAIN) {
            style.maxWidth = style.maxHeight = '100%';
        }
        return style;
        }
    },
    props:{
        imgView:{
            type:String,
        },
        showDowload:{
            type:Boolean,
            default:false
        }
    },
    mounted() {
        this.deviceSupportInstall();
        this.init();
    },
    destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    },
    methods: {
        handleMouseDown(e) {
            if (this.loading || e.button !== 0) return;
            const { offsetX, offsetY } = this.transform;
            const startX = e.pageX;
            const startY = e.pageY;
            this._dragHandler = rafThrottle(ev => {
                this.transform.offsetX = offsetX + ev.pageX - startX;
                this.transform.offsetY = offsetY + ev.pageY - startY;
            });
            on(document, 'mousemove', this._dragHandler);
            on(document, 'mouseup', ev => {
                off(document, 'mousemove', this._dragHandler);
            });
            e.preventDefault();
        },
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.closeImage();
           
            break;
          // SPACE
        //   case 32:
        //     this.toggleMode();
        //     break;
          // UP_ARROW
          case 38:
            this.viewBig();
            break;
          // RIGHT_ARROW
        //   case 39:
        //     this.next();
        //     break;
          // DOWN_ARROW
          case 40:
            this.viewReduc();
            break;
        }
      });
        this._mouseWheelHandler = rafThrottle(e => {
            const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
            if (delta > 0) {
                this.viewReduc();
            } else {
            this.viewBig();
            }
        });
        on(document, 'keydown', this._keyDownHandler);
        on(document, mousewheelEventName, this._mouseWheelHandler);
        },
        deviceSupportUninstall() {
        off(document, 'keydown', this._keyDownHandler);
        off(document, mousewheelEventName, this._mouseWheelHandler);
        this._keyDownHandler = null;
        this._mouseWheelHandler = null;
        },
        init(){
            this.transform = {
                scale: 1,
                deg: 0,
                offsetX: 0,
                offsetY: 0,
                enableTransition: false
            };
        },

        closeImage(){
            this.deviceSupportUninstall()
            this.$emit('hideViewImage')
        },
      
        // 下载文件
        downLoad(){
            this.$emit('downLoad');

        },
        viewBig(){
            this.transform.scale+=0.5;
        },
        viewReduc(){
            if(this.transform.scale>0.5){
                this.transform.scale-=0.5;
            }
        },
        clockWise(){
                this.transform.deg+=30

        },
        antiClockWise(){
            this.transform.deg-=30
        }
    },
    
}
</script>
<style lang="scss" scoped>
.el-image-viewer__mask {
    opacity: 0.78;
}
.el-image-viewer__close{
        color :#fff;
        top: 13px;
        right: 30px
}
</style>
