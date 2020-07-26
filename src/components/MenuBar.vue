<template>
  <div class="menu-bar">
    <div v-for="item in operations" class="btn" @click="handleClick(item.type)" :key="item.label">
      {{item.label}}
    </div>
    <div class="btn" @click="togglePreview">
      {{ showPreview ? '关闭预览' : '显示预览' }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import bus from '../utils/bus'

@Component
export default class MenuBar extends Vue {
  showPreview = true
  operations = [{
    label: '新建',
    type: 'createFile'
  }, {
    label: '打开',
    type: 'openFile'
  }, {
    label: '保存',
    type: 'saveFile'
  }, {
    label: '移除',
    type: 'removeFile'
  }, {
    label: '清空',
    type: 'clearFile'
  }, {
    label: '导出HTML',
    type: 'saveHtml'
  }, {
    label: '打开所在位置',
    type: 'findFile'
  }]

  @Prop() private msg!: string

  handleClick(type: string) {
    this.$emit(type)
  }

  togglePreview () {
    this.showPreview = !this.showPreview
    bus.$emit('togglePreview', this.showPreview)
  }
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
