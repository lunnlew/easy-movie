<template>
  <el-dropdown trigger="click" placement="bottom-start">
    <span class="el-dropdown-link">
      <span>标签</span>
      <span class="filters" v-if="tag_filters.filter((v) => v.checked).length > 0">
        :{{
          tag_filters
            .filter((v) => v.checked)
            .map((v) => v.name)
            .join(",")
        }}
      </span>
      <el-icon size="12">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu v-if="tag_filters.length">
        <div class="filter-ui">
          <div class="filter-ui-item" v-for="item of tag_filters" :key="item.key">
            <el-checkbox
              size="mini"
              v-model="item.checked"
              :checked="item.checked"
              :disabled="item.disabled"
              @change="
                (checked) =>
                  $emit('filter', {
                    type: 'tag_filter',
                    name: item.name,
                    key: item.key,
                    value: checked,
                  })
              "
            >
              <span class="name">{{ item.name }}</span>
              <span class="count">{{ item.count }}</span>
            </el-checkbox>
          </div>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
/**
 * 类型过滤器
 */
import { defineComponent } from "vue";
import { ArrowDown } from "@element-plus/icons";
import { tag_filters } from "@/lib/movieFilter";
export default defineComponent({
  name: "MovieFilter",
  emits: ["filter"],
  components: {
    ArrowDown,
  },
  setup: (props, { emit }) => {
    return {
      tag_filters,
    };
  },
});
</script>
<style lang="less"></style>
