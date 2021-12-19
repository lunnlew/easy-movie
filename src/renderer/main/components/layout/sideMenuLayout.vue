<template>
  <div class="side-menu-layout">
    <div class="menu-top">
      <el-tooltip content="菜单" placement="bottom">
        <el-icon class="icon-btn-op" @click.stop="showContextMenu($event)">
          <operation />
        </el-icon>
      </el-tooltip>
    </div>
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="side-menu"
      :default-active="$route.path"
      text-color="#fff"
    >
      <el-menu-item
        @click="
          libMenuClick({
            name: 'all',
          })
        "
      >
        <span>影片库</span>
        <div class="icon-btn-group">
          <el-icon class="icon-btn-plus" @click.stop="showNewLibDialog">
            <plus />
          </el-icon>
        </div>
      </el-menu-item>
      <el-menu-item
        v-for="lib of currentLibs"
        @click="libMenuClick(lib)"
        :key="lib.id"
        :index="lib.path"
        @contextmenu.prevent="showLibMenuClick($event, lib)"
      >
        <el-icon>
          <component :is="lib.meta.icon" />
        </el-icon>
        <span>{{ lib.meta.title || lib.name }}</span>
        <div class="icon-btn-group">
          <!-- <el-icon v-if="lib.scan_loading" class="icon-btn-remove">
            <Loading />
          </el-icon> -->
          <el-icon
            v-if="lib.name !== 'all'"
            class="icon-btn-remove"
            @click.stop="removeLibConfirm(lib)"
          >
            <close />
          </el-icon>
        </div>
      </el-menu-item>
      <el-menu-item
        @click="tagClick('alltags')"
        :key="'alltags'"
        :index="'alltags'"
      >
        <span>快捷标签</span>
      </el-menu-item>
      <el-menu-item
        v-for="tag of tags_menus"
        @click="tagClick(tag)"
        :key="tag.key"
        :index="tag.key"
      >
        <el-icon>
          <List />
        </el-icon>
        <span>{{ tag.name }}</span>
        <div class="icon-btn-group">
          <span style="margin-right: 10px">{{ tag.count }}</span>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
  <new-lib
    v-if="isShowNewLibDialog"
    @hide="isShowNewLibDialog = false"
  ></new-lib>
  <reset-lib-dir v-if="isShowResetDirView"></reset-lib-dir>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { Close, Plus, Operation, Loading, List } from "@element-plus/icons";
import newLib from "@/components/dialog/newLib.vue";
import ResetLibDir from "../dialog/resetLibDir.vue";
import { useStore } from "vuex";
import {
  isShowNewLibDialog,
  showNewLibDialog,
  removeLibConfirm,
} from "@/lib/lib";
import { showContextMenu, showLibMenu } from "@/lib/contextMenu";
import { libMenuClick } from "@/lib/sideMenu";
import { changeFilter, needTagFilter, tag_filters } from "@/lib/movieFilter";
export default defineComponent({
  name: "SideMenuLayout",
  components: {
    Plus,
    Close,
    Loading,
    Operation,
    newLib,
    ResetLibDir,
    List,
  },
  setup: () => {
    const store = useStore();

    onMounted(() => {
      store.dispatch("loadLibs");
    });

    const currentLibs = computed(() => store.state.libMenuView.menus);

    async function showLibMenuClick(event: MouseEvent, item: any) {
      const result = await showLibMenu(event, item);
      console.log(result);
    }

    const isShowResetDirView = computed(
      () => store.state.libMenuView.showResetDirView
    );

    const tags_menus = computed(() =>
      tag_filters.value.filter((item) =>
        ["recently_added", "watched", "unwatched"].includes(item.key)
      )
    );

    function tagClick(tag: any) {
      needTagFilter.value = true;
      tag_filters.value.map((v) => {
        if (v.key === tag.key) {
          v.checked = true;
          changeFilter({
            type: "tag_filter",
            name: v.name,
            key: v.key,
            value: true,
          });
        } else {
          changeFilter({
            type: "tag_filter",
            name: v.name,
            key: v.key,
            value: false,
          });
          v.checked = false;
        }
      });
    }

    return {
      libMenuClick,
      currentLibs,
      tagClick,
      tags_menus,
      showNewLibDialog,
      removeLibConfirm,
      showLibMenuClick,
      isShowResetDirView,
      isShowNewLibDialog,
      showContextMenu,
    };
  },
});
</script>
<style lang="less" scoped>
.side-menu-layout {
  width: 150px;
  min-height: 100%;
  background-color: #545c64;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  // border-right: 1px solid #e8e8e8;
  padding-top: 5px;
  box-sizing: border-box;
}
.el-menu {
  border-right: none !important;
}
.el-menu-item {
  height: 32px;
  line-height: 32px;
  &:hover {
    .icon-btn-plus {
      display: block;
    }
    .icon-btn-remove {
      display: block;
    }
  }
}
.icon-btn-group {
  position: absolute;
  right: 5px;
  display: inline-block;
  .icon-btn-plus,
  .icon-btn-remove {
    display: none;
  }
  &:hover {
    cursor: pointer;
  }
}
.menu-top {
  padding: 5px 15px;
  -webkit-app-region: drag;
  color: #fff;
}
.icon-btn-op {
  padding: 5px;
  -webkit-app-region: no-drag;
  &:hover {
    cursor: pointer;
    background: #4e5155;
  }
}
</style>
