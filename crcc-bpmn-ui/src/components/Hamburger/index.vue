<template>
    <svg-icon  :class="{'is-active':sidebar.opened}" class="hamburger"   icon-class="fold" />
</template>
<script>
import { mapGetters } from "vuex";

export default {
     computed: {
    ...mapGetters(["sidebar", "name", "positions", "mainPosition"]),
  },
  methods: {
    ChangeShow() {
      this.$store.dispatch("app/toggleSideBar");
    },
  }
}
</script>

<style lang="scss" scoped>
 .hamburger{
    display: inline-block;
    vertical-align: middle;
    width: 22px;
    height: 22px;
  }
    .hamburger.is-active {
    transform: rotate(180deg);
  }
</style>