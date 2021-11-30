<template>
  <base-layout>
    <div class="layout-page">
      <side-menu-layout></side-menu-layout>
      <content-layout class="page">
        <router-view v-slot="{ Component }">
          <transition
            :name="transitionName"
            enter-active-class="animate__animated animate__slideInRight"
            leave-active-class="animate__animated animate__slideOutLeft"
            enter-from-class="slide-enter"
            leave-to-class="slide-leave-to"
          >
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </content-layout>
    </div>
  </base-layout>
</template>
<script lang="ts">
import BaseLayout from "./baseLayout.vue";
import SideMenuLayout from "./sideMenuLayout.vue";
import ContentLayout from "./contentLayout.vue";
import {
  defineComponent, ref
} from "vue";
export default defineComponent({
  name: "PageLayout",
  components: {
    SideMenuLayout,
    ContentLayout,
    BaseLayout,
  },
  setup: () => {
    const transitionName = ref<string>('slide-left')
    return {
      transitionName,
      scrollbar: 'none',
    }
  }
});
</script>
<style lang="less">
.layout-page {
  display: flex;
  flex-direction: row;
  position: relative;
  height: 100%;
}
.content-scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.content-scroll {
  position: relative;
  height: 100%;
  width: 100%;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #535353;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: #363636db;
}
.content-scroll-wrapper::-webkit-scrollbar {
  display: v-bind(scrollbar);
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
}

.page-view {
  width: 100%;
  height: 100%;
  position: relative;
}

// .animate__slideInRight,
// .animate__slideOutLeft {
//   transition: opacity 0.5s;
// }

// .slide-enter,
// .slide-leave-to {
//   opacity: 0;
// }
</style>