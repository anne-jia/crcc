<!--  index-->
<template>
    <modelerView></modelerView>

</template>

<script>
// import customModeler from '@/components/crcc-bpmn/modeler-readonly/readonly-modeler.vue'
import {ModelerView} from '@crcc/bpmn-basic'
export default {
    components: {
        ModelerView
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
