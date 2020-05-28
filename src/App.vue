<template>
  <div id="app">
    <MenuBar></MenuBar>
    <div class="container">
      <EditPanel></EditPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MenuBar from './components/MenuBar.vue'
import EditPanel from './components/EditPanel.vue'

@Component({
  components: {
    MenuBar,
    EditPanel
  }
})
export default class App extends Vue {}
</script>

<style lang="stylus">
@import "./assets/stylus/var.styl"

html, body
  padding 0
  margin 0
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
.container
  height 100vh
  padding-top $menu-bar-height
  box-sizing border-box
</style>
