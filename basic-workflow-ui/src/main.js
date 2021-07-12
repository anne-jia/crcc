import initApp from './app-init'
import { bus } from '@linto/basic-framework'

function startApp(oldApp) {
  if (oldApp) {
    oldApp.$destroy()
  }
  const { app, router, store } = initApp()
  bus.$once('LogOut', () => {
    store.dispatch('LogOut').then(() => {
      startApp(app)
    })
  })

  router.onReady(() => {
    app.$mount('#app')
  })

}
startApp()