<template>
  <div id="app">
    <MenuBar
      :currentArticle="currentArticle"
      @createFile="createFile"
      @openFile="openFile"
      @saveFile="saveFile"
      @removeFile="removeFile"
      @clearFile="clearFile"
      @findFile="findFile"
      @saveHtml="saveHtml"
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
import { ipcRenderer, remote, shell } from 'electron'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ipcSend } from './utils'
import fs from 'fs'
import marked from 'marked'
import MenuBar from './components/MenuBar.vue'
import Side from './components/Side.vue'
import EditPanel from './components/EditPanel.vue'
import Article from './data/Article'

const currentWindow = remote.getCurrentWindow()

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
    this.articles.unshift(article)
    this.handleSelect(article.id)
  }

  // 打开文件
  openFile() {
    const filePaths = remote.dialog.showOpenDialogSync(currentWindow, {
      properties: ['openFile'],
      filters: [{ name: 'markdown', extensions: ['md', 'markdown'] }]
    })

    if (filePaths && filePaths[0]) {
      const hasPathMatch = this.articles.some(article => {
        if (filePaths[0] === article.filePath) {
          this.handleSelect(article.id)
          return true
        }
      })

      if (hasPathMatch) return

      const content = fs.readFileSync(filePaths[0], 'utf-8')
      const article = new Article(content, filePaths[0])
      this.articles.unshift(article)
      this.handleSelect(article.id)
    }
  }

  // 保存文件
  saveFile() {
    if (!this.currentArticle) return

    const filePath = this.currentArticle.filePath
    const content = this.currentArticle.content
    if (filePath) {
      fs.writeFileSync(filePath, content)
    } else {
      const resultPath = remote.dialog.showSaveDialogSync(currentWindow, {
        title: '保存文件',
        filters: [{ name: '文件', extensions: ['md', 'markdown'] }]
      })
      if (!resultPath) return

      fs.writeFileSync(resultPath, content)
      this.currentArticle.filePath = filePath
    }

    this.currentArticle.change = false
    this.showToast('保存成功')
  }

  // 移除文件
  removeFile() {
    if (this.currentArticle && this.articles.length > 0) {
      const idx = this.articles.findIndex(item => item.id === this.currentArticle!.id)
      this.articles.splice(idx, 1)
      if (this.articles[0] && this.articles[0].id) {
        this.handleSelect(this.articles[0].id)
      }
    }
  }

  // 清空文件
  clearFile() {
    window.localStorage.clear()
    this.articles = []
    this.handleSelect('')
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
      this.showToast('导出成功')
    }
  }

  // 定位文件
  findFile () {
    if (!this.currentArticle) return
    if (this.currentArticle.filePath) {
      shell.showItemInFolder(this.currentArticle.filePath)
    } else {
      alert('文件还未保存')
    }
  }

  // 侧边栏选择文件
  handleSelect(id: string) {
    const idMatch = this.articles.some(item => {
      if (item.id === id) {
        if (item.content === undefined) {
          const content = fs.existsSync(item.filePath) ? fs.readFileSync(item.filePath, 'utf-8') : ''
          item.content = content
        }
        this.currentArticle = item
        return true
      }
    })

    if (!idMatch) {
      this.currentArticle = null
    }
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

    ipcRenderer.on('menu-save-html', () => {
      this.saveHtml()
    })

    ipcRenderer.on('close', () => {
      const hasChange = this.articles.some(article => article.change)

      if (hasChange) {
        const index = remote.dialog.showMessageBoxSync(currentWindow, {
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

      currentWindow.destroy()
    })
  }

  @Watch('currentArticle', { immediate: true })
  currentArticleChange (value: any) {
    if (value && value.filePath) {
      window.document.title = value.filePath.slice(1).replace(/\//g, ' > ')
    }
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
