<template>
  <ul class="crcc-step-group">
    <template v-for="item in dataList">
      <li
        :key="item.stepNum"
        :class="[
          currentValue > item.stepNum || isSuccess
            ? 'success'
            : currentValue === item.stepNum
            ? 'current'
            : '',
          !openClick ? 'cursorDefault' : '',
        ]"
        :style="`width:${stepWidth}`"
        @click="clickStep(item)"
      >
        <i
          v-if="
            (iconInfo && iconInfo.success && currentValue > item.stepNum) ||
            isSuccess
          "
          :class="iconInfo.success"
          :style="iconStyle"
        ></i>
        <i
          v-else-if="
            iconInfo && iconInfo.active && currentValue === item.stepNum
          "
          :class="iconInfo.active"
          :style="iconStyle"
        ></i>
        <i
          v-else-if="iconInfo && iconInfo.default"
          :class="iconInfo.defalut"
          :style="iconStyle"
        ></i>
        <div v-else class="crcc-step-item--num">{{ item.stepNum }}</div>
        <div class="crcc-step-item--other">
          <div class="crcc-step-item-other--box"></div>
        </div>
        <div class="crcc-step-item--title">{{ item.name }}</div>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: "crccSteps",
  props: {
    value: {
      type: Number,
      default: 1,
    },
    openClick: {
      type: Boolean,
      default: false,
    },
    iconStyle: {
      type: String,
      default: null,
    },
    iconInfo: {
      type: Object,
      default: () => {
        return {
          success: "el-icon-success",
          active: null,
          defalut: null,
        };
      },
    },
    stepList: {
      type: Array,
      default: () => {
        return [
          {
            id: 1,
            name: "步骤1",
          },
          {
            id: 2,
            name: "步骤2",
          },
          {
            id: 3,
            name: "步骤3",
          },
          {
            id: 4,
            name: "步骤4",
          },
          {
            id: 5,
            name: "步骤5",
          },
          {
            id: 6,
            name: "步骤6",
          },
          {
            id: 7,
            name: "步骤7",
          },
          {
            id: 8,
            name: "步骤8",
          },
          {
            id: 9,
            name: "步骤9",
          },
        ];
      },
    },
    isSuccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentValue: 1,
      // 数据源
      // dataList: [],
    };
  },
  mounted() {
    if (this.currentValue !== this.value) {
      this.currentValue = this.stepList[this.stepList.length - 1].stepNum;
      this.$emit("input", this.stepList[this.stepList.length - 1].id);
      this.$emit("change", this.stepList[this.stepList.length - 1].id);
    }
  },
  watch: {
    value(val) {
      let currentInfo = this.stepList.find((item) => item.id === val);
      this.currentValue =
        (currentInfo && currentInfo.stepNum) ||
        this.stepList[this.stepList.length - 1].id;
    },
  },
  computed: {
    // 动态计算步骤条宽度
    stepWidth() {
      return `${100 / this.dataList.length}% `;
    },
    // 计算步骤数据源
    dataList() {
      let _dataList = [];
      if (this.stepList && this.stepList.length > 0) {
        _dataList = this.stepList.map((item, idx) => {
          item.stepNum = idx + 1;
          // 默认选中当前项
          if (item.id === this.value) {
            this.currentValue = item.stepNum;
          }
          return item;
        });
      }
      return _dataList;
    },
  },
  methods: {
    /* 点击步骤条触发 */
    clickStep(item) {
      if (!this.openClick) {
        return false;
      }
      this.currentValue = item.stepNum;
      this.$emit("input", item.id);
      this.$emit("change", item.id);
      this.$emit("clickStep", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.crcc-step-group {
  // margin: 10px;
  list-style: none;
  height: 40px;
  overflow: hidden;
  // 默认状态
  li {
    float: left;
    background: #f3f3f3;
    height: 100%;
    font-weight: bold;
    box-sizing: border-box;
    cursor: pointer;
    i,
    .crcc-step-item--num {
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      margin: 5px 4px 5px 0;
      margin-left: 20px;
    }
    i {
      color: #2b8cfa;
      float: left;
      font-size: 32px;
    }
    .crcc-step-item--num {
      background: #fff;
      float: left;
      color: #8e8e8e;
      text-align: center;
    }
    .crcc-step-item--title {
      overflow: hidden;
      text-align: left;
      line-height: 40px;
      color: #8e8e8e;
      position: relative;
    }
    &:not(:last-child) {
      .crcc-step-item--other {
        position: relative;
        float: right;
        height: 40px;
        width: 4px;
        margin-right: -14px;
        &::after,
        &::before {
          content: " ";
          border: 4px solid #fff;
          height: 23px;
          position: absolute;
          background: #fff;
          z-index: 2;
          box-sizing: content-box;
        }
        &::after {
          top: -8px;
          right: 9px;
          transform: rotate(146deg);
        }
        &::before {
          bottom: -6px;
          right: 8px;
          transform: rotate(30deg);
        }
        .crcc-step-item-other--box {
          width: 12px;
          height: 12px;
          background: #f3f3f3;
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translate(0, -50%);
          z-index: 1;
        }
      }
    }
  }
  // 已提交状态
  li.success {
    background: #eef9ff;
    .crcc-step-item--num {
      color: #fff;
      background: #2b8cfa;
    }
    .crcc-step-item--title {
      color: #2b8cfa;
    }
    .crcc-step-item--other {
      .crcc-step-item-other--box {
        background: #eef9ff;
      }
    }
  }
  // 当前选中状态
  li.current {
    background: #2b8cfa;
    .crcc-step-item--num {
      color: #2b8cfa;
    }
    .crcc-step-item--title {
      color: #fff;
    }

    .crcc-step-item--other {
      .crcc-step-item-other--box {
        background: #2b8cfa;
      }
    }
  }
  // 去掉可点击效果
  li.cursorDefault {
    cursor: default;
  }
}
</style>