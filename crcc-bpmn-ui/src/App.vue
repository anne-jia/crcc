<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    process.env.VUE_APP_IFRAME_STYLE === 'in-iframe'
      ? window.addEventListener('message', this.receiveMsg)
      : ''
  },
  methods: {
    receiveMsg({ data }) {
      if (data.source !== 'in-iframe') {
        return
      }
      const { name, path } = data
      this.$router.replace(path)
    }
  }
}
</script>
<style scoped>
#app {
  overflow: hidden;
}
</style>
