<template>
  <div class="section-wrapper">
    <div class="section">
      <span class="section-title">系统服务</span>
      <el-radio-group
        v-if="load_service_state"
        v-model="enable_service"
        class="item-list inline"
      >
        <el-radio :label="'none'">禁用</el-radio>
        <el-radio :label="'enable'">启用</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import { enable_service, load_service_state } from "@/lib/system";
import store from "@/store";
export default defineComponent({
  name: "Setting",
  components: {},
  setup: (props, { emit }) => {
    watch(
      () => enable_service.value,
      (newVal) => {
        if (load_service_state.value) {
          if (newVal === "enable") {
            store.dispatch("setting/installAsService");
          } else {
            store.dispatch("setting/uninstallAsService");
          }
        }
      }
    );

    async function loadStatus() {
      const result = await store.dispatch("invokeMainAction", {
        action: "loadServiceState",
        options: {},
      });
      if (result === "Started") {
        enable_service.value = "enable";
      } else {
        enable_service.value = "none";
      }
      setTimeout(() => {
        load_service_state.value = true;
      }, 1000);
    }
    onMounted(() => {
      loadStatus();
    });

    return { enable_service, load_service_state };
  },
});
</script>
<style lang="less" scoped>
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
