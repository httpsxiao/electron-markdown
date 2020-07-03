<template>
  <div class="edit-panel">
    <textarea class="edit" v-model="currentArticle.content"></textarea>
    <div class="preview" v-html="previewContent"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Article from '../data/Article'
import marked from 'marked'

@Component
export default class MenuBar extends Vue {
  @Prop() currentArticle!: Article

  get previewContent () {
    return marked(this.currentArticle.content)
  }

  // update (e) {
    // const value = e.currentTarget.value
    // console.log(value)
  // }
  // @Watch('content', { immediate: true })
  // contentChanged (val) {}
}
</script>

<style scoped lang="stylus">
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
