<template>
  <div class="edit-panel">
    <textarea class="edit" v-model="currentArticle.content"></textarea>
    <div class="preview" v-html="previewContent"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
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
  .preview
    flex 1
    border-left solid 1px #ccc
    padding 4px
</style>
