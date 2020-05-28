<template>
  <div class="edit-panel">
    <textarea class="edit" v-model="content"></textarea>
    <div class="preview" v-text="previewContent"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import marked from 'marked'

@Component
export default class MenuBar extends Vue {
  content = '# aaa'

  @Prop() private msg!: string

  get previewContent () {
    return marked(this.content)
  }
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
