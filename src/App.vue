<template>
  <div id="app">
    <MenuBar
      :currentArticle="currentArticle"
      @createFile="createFile"
      @openFile="openFile"
      @saveFile="saveFile"
      @removeFile="removeFile"
    ></MenuBar>
    <div class="container">
      <Side
        :articles="articles"
        :currentArticle="currentArticle"
        @select="handleSelect"
      ></Side>
      <EditPanel
        v-if="currentArticle"
        class="container-edit"
        :currentArticle="currentArticle"
        @input="input"
      ></EditPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, remote } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import { ipcSend } from './utils'
import fs from 'fs'
import marked from 'marked'
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

const currentWindow = remote.getCurrentWindow()

export default class App extends Vue {
  currentArticle: Article | null = null
  articles: Article[] = []
  created() {
    // alt + ctrl + shift + a键 清空本地缓存
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
    if (window.location.search.indexOf('menu') === -1) {
      this.getStorage()
    }
  }

  // 本地拿数据
  getStorage() {
    const currentId = '' + JSON.parse(window.localStorage.getItem('current-id') || '""')
    this.articles = JSON.parse(window.localStorage.getItem('articles') || '[]')
    if (currentId) { this.handleSelect(currentId) }
  }

  // 输入内容改变
  input (newValue: string) {
    if (this.currentArticle) {
      this.currentArticle.content = newValue
      this.currentArticle.change = true
    }
  }

  // 新建文件
  createFile() {
    if (this.currentArticle && !this.currentArticle.filePath) {
      alert('请先保存当前文件')
      return
    }

    const article = new Article()
    this.currentArticle = article
    this.articles.unshift(article)
  }

  // 打开文件
  async openFile() {
    const filePaths = await remote.dialog.showOpenDialog(currentWindow, {
      properties: ['openFile'],
      filters: [{ name: 'markdown', extensions: ['md', 'markdown'] }]
    })
    if (filePaths && filePaths[0]) {
      const content = fs.readFileSync(filePaths[0], 'utf-8')
      const article = new Article(content, filePaths[0])
      this.currentArticle = article
      this.articles.unshift(article)
    }
  }

  // 保存文件
  saveFile() {
    if (this.currentArticle) {
      ipcRenderer.send('save-file', this.currentArticle.content, this.currentArticle.filePath)
    }
  }

  // 移除文件
  removeFile() {
    if (this.currentArticle && this.articles.length > 0) {
      const idx = this.articles.findIndex(item => item.id === this.currentArticle!.id)
      this.articles.splice(idx, 1)
      if (this.articles[0]) {
        this.currentArticle = this.articles[0]
      }
    }
  }

  // 导出为 HTML
  saveHtml() {
    if (!this.currentArticle) return
    if (this.currentArticle.change) alert('请保存后导出')
    const filePath = remote.dialog.showSaveDialogSync(currentWindow, {
      title: '保存为HTML',
      filters: [{ name: 'html', extensions: ['html'] }]
    })
    if (filePath) {
      fs.writeFileSync(filePath, marked(this.currentArticle.content))
    }
  }

  // 侧边栏选择文件
  handleSelect(id: string) {
    this.articles.some(item => {
      if (item.id === id) {
        if (item.content === undefined) {
          const content = fs.existsSync(item.filePath) ? fs.readFileSync(item.filePath, 'utf-8') : ''
          item.content = content
        }
        this.currentArticle = item
        return true
      }
    })
  }

  // 主进程显示 toast
  @ipcSend()
  showToast(content: string) {
    return content
  }


  // 主进程通信
  ipcRendererEvent() {
    ipcRenderer.on('menu-create-file', () => {
      this.createFile()
    })

    ipcRenderer.on('menu-save-file', () => {
      this.saveFile()
    })

    ipcRenderer.on('menu-open-file', () => {
      this.openFile()
    })

    ipcRenderer.on('menu-remove-file', () => {
      this.removeFile()
    })

    ipcRenderer.on('saved-file', (event, filePath?: string) => {
      if (filePath) {
        this.currentArticle!.filePath = filePath
      }
      this.currentArticle!.change = false
      this.showToast('保存成功')
    })

    ipcRenderer.on('close', () => {
      const hasChange = this.articles.some(article => article.change)

      if (hasChange) {
        const index = remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
          type: 'warning',
          title: '文件未保存',
          message: '还有文件没有保存，确认退出吗？',
          buttons: ['退出', '取消'],
          cancelId: 1,
          defaultId: 0,
        })

        if (index === 1) return
      }

      const excludeContentArticles = this.articles.map(item => {
        const res = {}
        Object.keys(item).forEach(key => {
          if (key === 'change') {
            res[key] = false
          } else if (key !== 'content') {
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
