<!--  index-->
<template>
    <div class='bpmn-view'>
        <customModeler></customModeler>
    </div>
</template>

<script>
import customModeler from '@/components/crcc-bpmn/modeler-readonly/readonly-modeler.vue'
export default {
    components: {
        customModeler
    },
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {

    },
    mounted() {

    },
}
</script>

<style lang='scss' scoped>
.bpmn-view{
    height: 100%;
}
</style>
