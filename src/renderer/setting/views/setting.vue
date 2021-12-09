<template>
  <el-container>
    <el-header>
      <div class="header">
        <span>偏好设置</span>
        <div class="btn-group-right">
          <div
            class="icon-btn-group"
            :style="{ width: '40px', textAlign: 'right' }"
          >
            <el-icon @click.stop="hideWindow">
              <close />
            </el-icon>
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <ul class="menus">
          <li
            @click="toggle_section('base')"
            @mouseenter="() => {}"
            :class="{ active: current_section == 'base' }"
          >
            <el-icon size="22">
              <close />
            </el-icon>
            <span>常用</span>
          </li>
          <li
            @click="toggle_section('notify')"
            @mouseenter="() => {}"
            :class="{ active: current_section == 'notify' }"
          >
            <el-icon size="22">
              <notification />
            </el-icon>
            <span>通知</span>
          </li>
          <li
            @click="toggle_section('filter')"
            @mouseenter="() => {}"
            :class="{ active: current_section == 'filter' }"
          >
            <el-icon size="22">
              <Filter />
            </el-icon>
            <span>筛选</span>
          </li>
          <li
            @click="toggle_section('proxy')"
            @mouseenter="() => {}"
            :class="{ active: current_section == 'proxy' }"
          >
            <el-icon size="22">
              <Filter />
            </el-icon>
            <span>代理</span>
          </li>
        </ul>
      </el-aside>
      <el-main>
        <div class="main">
          <base-section v-if="current_section === 'base'"></base-section>
          <filter-section
            v-else-if="current_section === 'filter'"
          ></filter-section>
          <proxy-section
            v-else-if="current_section === 'proxy'"
          ></proxy-section>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { Close, Filter, Notification } from "@element-plus/icons";
import { windowControl } from "@/lib/native";
import FilterSection from "setting@/views/filter.vue";
import BaseSection from "setting@/views/base.vue";
import ProxySection from "setting@/views/proxy.vue";
export default defineComponent({
  name: "Setting",
  components: {
    Close,
    Filter,
    Notification,
    BaseSection,
    FilterSection,
    ProxySection,
  },
  setup: (props, { emit }) => {
    console.log("setup");
    function hideWindow() {
      windowControl("hide");
    }
    const current_section = ref("base");
    function toggle_section(section: string) {
      current_section.value = section;
    }
    return {
      hideWindow,
      toggle_section,
      current_section,
    };
  },
});
</script>
<style lang="less">
.el-container {
  height: 100%;
}
.el-header {
  height: 39px;
  padding: 0;
}
.el-aside {
  background-color: #3b3b3b;
  color: #fff;
  border-right: 1px solid #333333;
}
.el-main {
  background-color: #434343;
  color: #fff;
}
.header {
  padding: 8px 20px 8px 30px;
  -webkit-app-region: drag;
  color: #fff;
  height: 39px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #353535;
  border-bottom: 1px solid #272727;
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
    -webkit-app-region: no-drag;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background: #d92424;
    }
    &.active {
      background: #d92424;
    }
  }
}
.menus {
  li {
    padding: 5px 15px;
    cursor: pointer;
    line-height: 32px;
    height: 32px;
    font-size: 14px;
    display: flex;
    align-items: center;
    &:hover {
      background: #d92424;
    }
    &.active {
      background: #d92424;
    }
    .el-icon {
      margin-right: 10px;
    }
  }
}
.main {
  font-size: 14px;
}
.section {
  padding: 10px 0;
}
</style>