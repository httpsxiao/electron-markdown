<template>
  <div id="app">
    <MenuBar
      :currentArticle="currentArticle"
      @createFile="createFile"
      @saveFile="saveFile"
    ></MenuBar>
    <div class="container">
      <EditPanel v-if="currentArticle" :currentArticle="currentArticle"></EditPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import MenuBar from './components/MenuBar.vue'
import EditPanel from './components/EditPanel.vue'
import Article from './data/Article'

@Component({
  components: {
    MenuBar,
    EditPanel
  }
})
export default class App extends Vue {
  currentId = null
  currentArticle: Article | null = null
  articles: Article[] = []
  created () {
    ipcRenderer.on('opened-file', (event: any, filePath: string, content: string) => {
      const article = new Article(content, filePath)
      this.currentArticle = article
      this.articles.unshift(article)
    })
    ipcRenderer.on('saved-file', (event: any, filePath?: string) => {
      if (filePath && this.currentArticle) {
        this.currentArticle.filePath = filePath
      }
      alert('保存成功')
    })
  }
  createFile () {
    const article = new Article()
    this.currentArticle = article
    this.articles.unshift(article)
  }
  saveFile () {
    if (this.currentArticle) {
      ipcRenderer.send('save-file', this.currentArticle.content, this.currentArticle.filePath)
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
  height 100vh
  padding-top $menu-bar-height
  box-sizing border-box
</style>
