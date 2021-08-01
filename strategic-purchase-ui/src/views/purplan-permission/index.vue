<template>
  <AuthSubjectTableWithOrgTree :orgDeepType="orgDeepType"></AuthSubjectTableWithOrgTree>
</template>

<script>

export default {
    data() {
        return {
          // 1 到组织 2 到项目部
          orgDeepType: 2
        };
    },
};
</script>

<style lang="scss">
</style>
