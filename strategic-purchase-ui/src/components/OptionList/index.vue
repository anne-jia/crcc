<template>
  <el-select
    :disabled="disabled"
    popper-append-to-body
    :value="getValue"
    @change="change"
    :clearable="clearable"
    :filterable="filterable"
    ref="optionList"
    placeholder=" "
    style="width: 100%"
  >
    <el-option
      v-for="(item, index) in optionValue"
      :key="index"
      :label="item.label"
      :value="item.value"
      filterable
    >
      <div class="option-list"  v-show-tips="{'width':width}">
        <span> {{ item.label?item.label : item.value}}</span>
      </div>
    </el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      width: 0,
    };
  },
  props: {
    optionValue: {
      type: Array,
      default: [
        {
          label: {
              type:[String,Number],
          },
          value: {
              type:[String,Number,Object],
               required: true

          },
          disabled:{
              type:Boolean,
              default:false
          }
        },
      ],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  
    value: {
      type: [String, Number,Boolean],
    },
    filterable:{
        type:Boolean,
        default:true
    },
    clearable:{
        type:Boolean,
        default:true
    },
    changeWidth:{
        type:[Boolean,String,Number]
    }
  },
  computed: {
    getValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value',val)
      },
    },
  },
  mounted() {
  },
  updated() {
      this.getWidth()
 
  },
  watch:{
    'changeWidth':{
        handler(val,oldVal){
            if(val){
                this.getWidth();
            }
        },
        immediate:true,
        deep:true
    }
  },
  methods: {
    change(value) {
      this.$emit("change", value);
    },
    getWidth(){
        if(this.$refs.optionList){
            this.width= this.$refs.optionList.$el.clientWidth;
        }
   }
  },
};
</script>

