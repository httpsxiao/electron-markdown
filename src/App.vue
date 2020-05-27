<template>
  <div id="app">
    <MenuBar/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MenuBar from './components/MenuBar.vue'

@Component({
  components: {
    MenuBar
  }
})
export default class App extends Vue {}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
