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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ipcSend } from '../utils'

@Component
export default class MenuBar extends Vue {
  @Prop() private msg!: string

  @ipcSend()
  createFile() { /* 新建文件 */ }

  @ipcSend()
  openFile() { /* 打开文件 */ }

  @ipcSend()
  saveFile() { /* 保存文件 */ }
}
</script>

<style scoped lang="stylus">
.menu-bar
  display flex
  height 30px
  line-height 30px
  color #fff
  background-color #504d4d
  padding 4px
  .btn
    font-size 14px
    border-radius 4px
    padding 0 10px
    margin-right 10px
    &:hover
      cursor pointer
      background-color #333
</style>
