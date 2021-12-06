<template>
  <div class="section">在筛选器显示</div>
  <el-checkbox-group v-model="checkList" class="filterList" @change="change">
    <el-checkbox
      :label="item.value"
      v-for="item of filterList"
      :key="item.value"
    >
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>
<script lang="ts">
import store from "@/store";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Setting",
  components: {},
  setup: (props, { emit }) => {
    const checkList = ref([]);
    const filterList = ref([
      {
        label: "类型",
        value: "type",
      },
      {
        label: "语言",
        value: "lang",
      },
    ]);
    function change(val) {
      store.dispatch("invokeViewAction", {
        name: "mainView",
        action: "changeFilterSetting",
        options: val,
        await_complete: false,
      });
    }
    return {
      checkList,
      filterList,
      change,
    };
  },
});
</script>
<style lang="less">
.filterList {
  display: table-caption;
  .el-checkbox {
    height: 25px;
    color: #fff;
  }
}
</style>
