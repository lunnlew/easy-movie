<template>
  <div class="layout-content">
    <div class="layout-content__header">
      <slot name="header">
        <div class="menu-top">
          <el-icon
            class="icon-btn-op"
            v-if="$route.name == 'MovieDetail'"
            @click.stop="$router.back()"
          >
            <back />
          </el-icon>
          <div class="btn-group-right">
            <div class="icon-btn-group">
              <el-tooltip v-if="$route.name == 'libitem'" content="排序" placement="bottom">
                <el-icon :class="{ 'active': isShowSort }" @click.stop="toggleSortTool">
                  <Sort />
                </el-icon>
              </el-tooltip>
              <el-tooltip v-if="$route.name == 'libitem'" content="筛选工具" placement="bottom">
                <el-icon :class="{ 'active': isShowFilter }" @click.stop="toggleFilterTool">
                  <Filter />
                </el-icon>
              </el-tooltip>
              <movie-search v-if="$route.name == 'libitem'"></movie-search>
            </div>
            <div class="icon-btn-group" :style="{ width: '40px', textAlign: 'right' }">
              <el-icon @click.stop="closeWindow">
                <close />
              </el-icon>
            </div>
          </div>
        </div>
      </slot>
    </div>
    <div class="layout-content__main">
      <slot></slot>
    </div>
    <update-tip v-if="showUpdateTip && !showUpdateCancel && needUpdateAlert"></update-tip>
  </div>
</template>
<script lang="ts">
import {
  Back,
  Close,
  Filter,
  Sort
} from '@element-plus/icons'
import {
  defineComponent, ref,
} from "vue";
import movieSearch from '@/components/movieSearch/index.vue'
import { isShowFilter, toggleFilterTool } from '@/lib/movieFilter'
import UpdateTip from '@/components/dialog/updateTip.vue';
import { windowControl } from '@/lib/native'
import { showUpdateTip, showUpdateCancel, needUpdateAlert } from '@/lib/update'
export default defineComponent({
  name: "ContentLayout",
  components: {
    movieSearch,
    Back,
    Filter,
    Sort,
    Close,
    UpdateTip
  },
  setup: () => {
    function closeWindow() {
      windowControl('close')
    }
    const isShowSort = ref(false)
    function toggleSortTool(){
      isShowSort.value = !isShowSort.value
    }
    return {
      isShowFilter,
      toggleFilterTool,
      isShowSort,
      toggleSortTool,
      showUpdateCancel,
      showUpdateTip,
      needUpdateAlert,
      closeWindow
    }
  }
});
</script>
<style lang="less" scoped>
.layout-content {
  flex: 1;
  background-color: #363636db;
  overflow: hidden;
  padding-bottom: 40px;
}
.layout-content__header {
  height: 39px;
  background-color: #545c64;
  padding: 0 20px 0 0;
  box-sizing: border-box;
}
.layout-content__main {
  position: relative;
  height: 100%;
}

.menu-top {
  padding: 8px 0 0 0;
  -webkit-app-region: drag;
  color: #fff;
  height: 39px;
  box-sizing: border-box;
  .icon-btn-group {
    display: inline-block;
    cursor: pointer;
    position: relative;
  }
  .btn-group-right {
    display: inline-block;
    position: absolute;
    right: 10px;
  }
  .el-icon {
    padding: 5px;
    margin: 0 2px;
    -webkit-app-region: no-drag;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background: #4e5155;
    }
    &.active {
      background: #4e5155;
    }
  }
}
</style>