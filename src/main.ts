import Vue from 'vue'
import App from './App.vue'
import { remote } from 'electron'


window.addEventListener('keydown', e => {
  const { altKey, ctrlKey, metaKey, keyCode } = e
  if (altKey && ctrlKey && metaKey && keyCode === 68){
    const currentWebContents = remote.getCurrentWebContents()
    currentWebContents && currentWebContents.toggleDevTools()
    e.preventDefault()
  }
}, false)

window.document.title = 'markdown 编辑器'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
