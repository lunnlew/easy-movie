<template>
  <div class="section">
    主题
    <ul class="theme">
      <li v-for="(item, index) of themes" :key="index">
        <div :style="item.style"></div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Setting",
  components: {},
  setup: (props, { emit }) => {
    const themes = [
      {
        style: {
          background: "#409EFF",
        },
      },
      {
        style: {
          background: "#ffffff",
        },
      },
      {
        style: {
          background: "#4e5155",
        },
      },
    ];
    return { themes };
  },
});
</script>
<style lang="less">
.theme {
  list-style: none;
  padding-top: 20px;
  margin: 0;
  li {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    border-radius: 3px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
    &:hover {
      border: 1px solid #66b1ff;
    }
    &.active {
      border: 1px solid #66b1ff;
    }
    div {
      border-radius: 3px;
      width: 25px;
      height: 25px;
    }
  }
  li + li {
    margin-left: 5px;
  }
}
</style>
