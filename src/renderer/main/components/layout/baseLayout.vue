<template>
  <div class="layout-base">
    <div class="layout-base__header">
      <slot name="header"></slot>
    </div>
    <div class="layout-base__content">
      <slot></slot>
    </div>
    <div class="layout-base__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
} from "vue";
export default defineComponent({
  name: "BaseLayout",
});
</script>
<style  lang="less">
.layout-base {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.layout-base__header{
  height: 50px;
  background-color: #545c64;
  padding: 0 20px;
  box-sizing: border-box;
  display: none;
}
.layout-base__content{
  flex: 1;
}
</style>