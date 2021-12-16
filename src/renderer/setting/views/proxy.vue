<template>
  <div class="section-wrapper">
    <div class="section">
      <span class="section-title">代理</span>
      <el-radio-group v-model="type" class="item-list">
        <el-radio :label="'none'">不使用代理</el-radio>
        <el-radio :label="'system'">使用系统代理</el-radio>
        <el-radio :label="'custom'"
          >自定义代理：
          <el-input
            :disabled="type !== 'custom'"
            style="width: 200px"
            v-model="proxy"
            size="mini"
            placeholder=""
        /></el-radio>
      </el-radio-group>
    </div>
    <div class="section" v-if="changed">* 代理设置需要应用重启后生效</div>
  </div>
</template>
<script lang="ts">
import store from "@/store";
import { defineComponent, onMounted, ref, watch } from "vue";
export default defineComponent({
  name: "proxy",
  components: {},
  setup: (props, { emit }) => {
    /**
     * 启用的代理项
     */
    const checkList = ref([]);
    /**
     * 所有代理项
     */
    const filterList = ref([]);
    onMounted(() => {});

    const type = ref("none");
    const proxy = ref("");
    const changed = ref(true);
    const load_proxy_state = ref(false);
    watch(
      () => type.value,
      () => {
        if (type.value !== "custom" && load_proxy_state.value) {
          store.dispatch("invokeMainAction", {
            action: "setProxySetting",
            options: {
              type: type.value,
              proxy: type.value === "custom" ? proxy.value : type.value,
            },
            await_complete: false,
          });
        }
      }
    );
    watch(
      () => proxy.value,
      () => {
        if (load_proxy_state.value) {
          store.dispatch("invokeMainAction", {
            action: "setProxySetting",
            options: {
              type: type.value,
              proxy: type.value === "custom" ? proxy.value : type.value,
            },
            await_complete: false,
          });
        }
      }
    );
    onMounted(async () => {
      const result = await store.dispatch("invokeMainAction", {
        action: "loadProxySetting",
        options: {},
      });
      if (!["none", "system"].includes(result)) {
        type.value = "custom";
        proxy.value = result;
      } else {
        type.value = result;
      }
      setTimeout(() => {
        load_proxy_state.value = true;
      }, 1000);
    });
    function reluanch() {
      store.dispatch("invokeMainAction", {
        action: "reluanch",
        options: {},
      });
    }
    return {
      checkList,
      filterList,
      proxy,
      reluanch,
      changed,
      type,
    };
  },
});
</script>
<style lang="less" scoped>
.item-list {
  display: table-caption;
  padding-top: 20px;
  .el-radio {
    height: 30px;
    color: #fff;
    width: 300px;
    margin: 0;
  }
}
</style>
