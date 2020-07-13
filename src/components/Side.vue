<template>
  <div class="side">
    <ul class="list">
      <li v-for="item in articles" :key="item.id" class="item" :class="{ current: currentId === item.id }" @click="handleClick(item.id)">
        <div class="path">{{item.filePath}}</div>
        <div>
          <div class="edit-icon" v-if="item.change"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
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
      padding 10px
      border-top 1px solid #ccc
      cursor pointer
      &:first-child
        border-top none
      &:last-child
        border-bottom 1px solid #ccc
      &.current
        background-color #bbb
      .edit-icon
        width 10px
        height 10px
        background-color #0ff
        border-radius 50%
</style>
