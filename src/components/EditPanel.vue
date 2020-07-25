<template>
  <div class="edit-panel">
    <textarea class="edit" :value="currentArticle.content" @input="handleInput"></textarea>
    <div v-if="showPreview" class="preview" v-html="previewContent"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import marked from 'marked'
import Article from '../data/Article'
import bus from '../utils/bus'

@Component
export default class MenuBar extends Vue {
  currentContent = ''
  showPreview = true

  @Prop() currentArticle!: Article

  mounted () {
    bus.$on('togglePreview', (isShow: boolean) => {
      this.showPreview = isShow
    })
  }

  get previewContent () {
    return marked(this.currentContent || '')
  }

  @Watch('currentArticle.content', { immediate: true })
  contentChange (value: string) {
    this.currentContent = value
  }

  @Emit('input')
  handleInput (e: any) {
    const newValue = e.currentTarget.value
    this.currentContent = newValue
    return newValue || ''
  }
}
</script>

<style scoped lang="stylus">
@import "../assets/stylus/preview.styl"

.edit-panel
  display flex
  height 100%
  .edit
    flex 1
    resize none
    outline none
    font-size 14px
    padding 4px
    border 0
    &::-webkit-scrollbar
      display none
  .preview
    flex 1
    height 100%
    overflow auto
    padding 4px
    border-left solid 1px #ccc
    box-sizing border-box
    &::-webkit-scrollbar
      display none
</style>
