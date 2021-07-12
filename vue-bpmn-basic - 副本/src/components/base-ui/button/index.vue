<!--  index-->
<template>
    <button
    class="el-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <svg-icon :icon-class="icon" v-if="icon && !loading"></svg-icon>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
export default {
    name: 'elButton',
     inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    props: {
        type: {
            type: String,
            default: 'default'
        },
        size: {
            type: String,
            default: 'mini'
        },
        icon: {
            type: String,
            default: ''
        },
        nativeType: {
            type: String,
            default: 'button'
        },
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        autofocus: Boolean,
        round: Boolean,
        circle: Boolean
    },
    components: {

    },
    data() {
        return {

        }
    },
    computed: {
        _elFormItemSize() {
            return (this.elFormItem || {}).elFormItemSize;
        },
        buttonSize() {
            return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        },
        buttonDisabled() {
            return this.disabled || (this.elForm || {}).disabled;
        }
    },
    methods: {
        handleClick(evt) {
            this.$emit('click', evt);
        }
    },
    mounted() {

    },
}
</script>

<style lang='scss' scoped>

</style>
