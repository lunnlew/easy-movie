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
import { loadConfig } from "@/lib/config";
import store from "@/store";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "Setting",
  components: {},
  setup: (props, { emit }) => {
    /**
     * 启用的筛选配置项
     */
    const checkList = ref([]);
    /**
     * 所有筛选配置项
     */
    const filterList = ref([]);
    function change(val) {
      store.dispatch("invokeViewAction", {
        name: "mainView",
        action: "setFilterSetting",
        options: filterList.value.map((item) => {
          return {
            value: item.value,
            label: item.label,
            checked: val.includes(item.value),
          };
        }),
        await_complete: false,
      });
    }
    onMounted(() => {
      loadConfig({
        type: "filter_setting",
      }).then((result) => {
        const filters = result.map((item: any) => {
          return {
            label: item.name,
            value: item.val,
            checked: item.state == 1 ? true : false,
          };
        });
        checkList.value = filters.filter((i) => i.checked).map((i) => i.value);
        filterList.value = filters;
      });
    });
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
