<template>
  <div class="menu-bar">
    <div class="btn" @click="createFile">
      新建
    </div>
    <div class="btn" @click="openFile">
      打开
    </div>
    <div class="btn" @click="saveFile">
      保存
    </div>
    <div class="btn" @click="removeFile">
      移除
    </div>
    <div class="btn" @click="saveHtml">
      导出HTML
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'

@Component
export default class MenuBar extends Vue {
  @Prop() private msg!: string

  @Emit('createFile')
  createFile() { /* 新建文件 */ }

  @Emit('openFile')
  openFile() { /* 打开文件 */ }

  @Emit('saveFile')
  saveFile() { /* 保存文件 */ }

  @Emit('removeFile')
  removeFile() { /* 移除文件 */ }

  @Emit('saveHtml')
  saveHtml() { /* 导出为html */ }
}
</script>

<style scoped lang="stylus">
@import "../assets/stylus/var.styl"

.menu-bar
  position absolute
  top 0
  left 0
  right 0
  display flex
  height $menu-bar-height - 10px
  line-height $menu-bar-height - 10px
  color #fff
  background-color #504d4d
  padding 5px
  .btn
    font-size 14px
    border-radius 4px
    padding 0 10px
    margin-right 10px
    &:hover
      cursor pointer
      background-color #333
</style>
