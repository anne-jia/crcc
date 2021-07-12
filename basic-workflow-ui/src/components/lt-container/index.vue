<template>
  <div class="lt-container" :style="{ height }">
    <div class="lt-main" :style="{ ...mainStyle }">
      <slot name="main"></slot>
    </div>
    <div
      class="lt-right"
      :style="{ 'flex-basis': rightExpanded ? toggleWidth : '1px', ...rightStyle }"
      v-if="showToggle"
    >
      <div class="toggle" @click="toggleRight">
        <i :class="[rightExpanded ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left']"></i>
      </div>
      <div class="content">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LtContainer",

  data() {
    return {
      rightExpanded: true
    };
  },

  props: {
    height: {
      type: String,
      default: "500px"
    },

    toggleWidth: {
      type: String,
      default: "400px"
    },

    mainStyle: Object,

    rightStyle: Object,

    showToggle: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    arrowClass() {
      return {};
    }
  },

  methods: {
    toggleRight() {
      this.rightExpanded = !this.rightExpanded;
    }
  }
};
</script>

<style lang="scss">
.lt-container {
  display: flex;
  flex-flow: row nowrap;

  .lt-main {
    flex: 1 1 auto;
    border: 1px solid #ebeef5;
    border-right: none;
    overflow: hidden;
  }

  .lt-right {
    flex: 0 0;
    position: relative;
    transition: flex-basis 0.28s;
    border: 1px solid #ebeef5;

    .toggle {
      position: absolute;
      top: 50%;
      background: #fff;
      left: -21px;
      z-index: 10;
      padding: 15px 5px;
      border: 1px solid #ddd;
      border-right: none;
      transform-origin: top left;
      font-size: 12px;
      user-select: none;
      border-radius: 3px 0px 0 3px;
    }

    .content {
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>

