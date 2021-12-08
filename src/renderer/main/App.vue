<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less">
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
.el-dialog {
  background: #434343 !important;
  color: #fff;
  font-size: 14px;
  .el-dialog__title {
    color: #fff;
    font-size: 16px;
  }
  .el-form-item__label {
    color: #fff;
  }
  .el-dialog__headerbtn{
    top: 15px;
  }
  .el-dialog__header {
    background: #383838;
    padding: 10px;
  }
}
</style>
