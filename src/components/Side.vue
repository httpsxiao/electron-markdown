<template>
  <div class="side">
    <ul>
      <li v-for="item in articles" :key="item.id" :class="{ current: currentId === item.id }" @click="handleClick(item.id)">
        {{item.filePath}}
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
}
</script>

<style scoped lang="stylus">
.side
  width 200px
  height 100%
  background-color #eee
  box-sizing border-box
  ul
    padding 0
    margin 0
    li
      padding 10px
      border-top 1px solid #ccc
      cursor pointer
      &:first-child
        border-top none
      &:last-child
        border-bottom 1px solid #ccc
      &.current
        background-color #bbb
</style>
