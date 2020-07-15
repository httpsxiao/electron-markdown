<template>
  <div class="side">
    <ul class="list">
      <li v-for="item in articles" :key="item.id" class="item" :class="{ current: currentId === item.id }" @click="handleClick(item.id)">
        <div class="path">{{extractLast(item.filePath)}}</div>
        <div>
          <div class="edit-icon" v-if="item.change"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import Article from '../data/Article'

@Component
export default class Side extends Vue {
  @Prop() articles!: Article[]
  @Prop() currentArticle!: Article | null

  get currentId() {
    return this.currentArticle ? this.currentArticle.id : ''
  }

  @Emit('select')
  handleClick(id: string) {
    return id
  }

  extractLast(path = '') {
    if (path === '') return '未命名'

    const arr = path.split('/')
    return arr[arr.length - 1]
  }
}
</script>

<style scoped lang="stylus">
.side
  width 200px
  height 100%
  background-color #eee
  box-sizing border-box
  .list
    padding 0
    margin 0
    .item
      display flex
      justify-content space-between
      align-items center
      height 40px
      line-height 40px
      padding 0 10px
      border-top 1px solid #ccc
      cursor pointer
      &:first-child
        border-top none
      &:last-child
        border-bottom 1px solid #ddd
      &.current
        background-color #bbb
      .path
        width 160px
        font-size 16px
        overflow hidden
        text-overflow ellipsis
      .edit-icon
        width 10px
        height 10px
        background-color #0ff
        border-radius 50%
</style>
