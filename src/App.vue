<template>
  <div id="app">
    <MenuBar
      :currentArticle="currentArticle"
      @createFile="createFile"
      @saveFile="saveFile"
    ></MenuBar>
    <div class="container">
      <Side :articles="articles" :currentArticle="currentArticle" @select="handleSelect"></Side>
      <EditPanel v-if="currentArticle" class="container-edit" :currentArticle="currentArticle"></EditPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, remote } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import { ipcSend } from './utils'
import fs from 'fs'
import MenuBar from './components/MenuBar.vue'
import Side from './components/Side.vue'
import EditPanel from './components/EditPanel.vue'
import Article from './data/Article'

@Component({
  components: {
    MenuBar,
    Side,
    EditPanel
  }
})
export default class App extends Vue {
  currentArticle: Article | null = null
  articles: Article[] = []
  created() {
    window.addEventListener('keydown', e => {
      const { altKey, ctrlKey, metaKey, keyCode } = e
      if (altKey && ctrlKey && metaKey && keyCode === 65){
        window.localStorage.clear()
        this.articles = []
        this.currentArticle = null
        e.preventDefault()
      }
    }, false)

    this.ipcRendererEvent()
    this.getStorage()
  }
  getStorage() {
    const currentId = '' + JSON.parse(window.localStorage.getItem('current-id') || '""')
    this.articles = JSON.parse(window.localStorage.getItem('articles') || '[]')
    if (currentId) { this.handleSelect(currentId) }
  }
  ipcRendererEvent() {
    ipcRenderer.on('opened-file', (event, filePath: string, content: string) => {
      const article = new Article(content, filePath)
      this.currentArticle = article
      this.articles.unshift(article)
    })
    ipcRenderer.on('saved-file', (event, filePath?: string) => {
      if (filePath && this.currentArticle) {
        this.currentArticle.filePath = filePath
      }
      this.currentArticle.change = false
      this.showToast('保存成功')
    })
    ipcRenderer.on('close', () => {
      const hasChange = this.articles.some(article => article.change)

      if (hasChange) {
        const result = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
          type: 'warning',
          title: '还有文件没有保存',
          message: '确认退出吗？',
          buttons: ['退出', '取消'],
          cancelId: 1,
          defaultId: 0,
        })

        if (result === 1) return
      }

      const excludeContentArticles = this.articles.map(item => {
        const res = {}
        Object.keys(item).forEach(key => {
          if (key === 'change') {
            res[key] = false
            return
          }
          if (key !== 'content') {
            res[key] = item[key]
          }
        })
        return res
      })
      window.localStorage.setItem('articles', JSON.stringify(excludeContentArticles))
      this.currentArticle && window.localStorage.setItem('current-id', this.currentArticle.id)

      const currentWindow = remote.getCurrentWindow()
      currentWindow.destroy()
    })
  }
  createFile() {
    const article = new Article()
    this.currentArticle = article
    this.articles.unshift(article)
  }
  saveFile() {
    if (this.currentArticle) {
      ipcRenderer.send('save-file', this.currentArticle.content, this.currentArticle.filePath)
    }
  }
  handleSelect(id: string) {
    this.articles.some(item => {
      if (item.id === id) {
        if (item.content === undefined) {
          const content = fs.existsSync(item.filePath) ? fs.readFileSync(item.filePath, 'utf-8') : ''
          this.currentArticle = new Article(content, item.filePath, item.id)
        } else {
          this.currentArticle = item
        }
        return true
      }
    })
  }
  @ipcSend()
  showToast(content: string) {
    return content
  }
}
</script>

<style lang="stylus">
@import "./assets/stylus/var.styl"

html, body
  padding 0
  margin 0
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
.container
  display flex
  height 100vh
  padding-top $menu-bar-height
  box-sizing border-box
  .container-edit
    flex 1
</style>
