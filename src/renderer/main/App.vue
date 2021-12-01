<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
*,
html {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html,
body,
#app {
  height: 100%;
}
.top-btns {
  height: 56px;
  background-color: #5c646c;
  box-sizing: border-box;
  padding: 10px 20px;
}
</style>
