<template>
  <el-dropdown trigger="click" placement="bottom-start">
    <span class="el-dropdown-link">
      <span>主演</span>
      <span class="filters" v-if="main_star_filters.length > 0"
        >:{{
          main_star_filters
            .filter((v, i) => i < 10)
            .map((v) => v.name_cn)
            .join(",")
        }}</span
      >
      <el-icon size="12">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <div class="filter-ui main-star">
          <div class="search-area">
            <el-input
              size="mini"
              class="search-input"
              v-model="search_main_star"
              placeholder="搜索"
            >
              <!-- <template #append>
                                <el-button :icon="Search"></el-button>
                            </template>-->
            </el-input>
            <ul
              v-infinite-scroll="loadData"
              infinite-scroll-immediate="false"
              class="infinite-list"
              style="overflow: auto"
            >
              <li
                v-for="item of list"
                :key="item.id"
                class="infinite-list-item"
                @click="selectMainStar(item)"
              >
                {{ item.name_cn }}
              </li>
            </ul>
          </div>
          <div class="show-area">
            <ul
              infinite-scroll-immediate="false"
              class="infinite-list"
              style="overflow: auto"
            >
              <li
                v-for="item of main_star_filters"
                :key="item.id"
                class="infinite-list-item"
                @click="unSelectMainStar(item)"
              >
                {{ item.name_cn }}
              </li>
            </ul>
          </div>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
/**
 * 主演过滤器
 */
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { ArrowDown, Search, Check } from "@element-plus/icons";
import { main_star_filters } from "@/lib/movieFilter";
import { getActors } from "@/api/movie";
export default defineComponent({
  name: "MovieFilter",
  emits: ["filter"],
  components: {
    ArrowDown,
    Search,
    Check,
  },
  setup: (props, { emit }) => {
    const search_main_star = ref("");
    const pagination = reactive({
      page: 1,
      size: 50,
    });
    const list = ref([]);
    const loadData = () => {
      getActors({
        page: pagination.page,
        size: pagination.size,
        name: search_main_star.value,
      }).then((res) => {
        list.value.push(...res.data.data);
        pagination.page++;
      });
    };

    watch(
      () => search_main_star.value,
      () => {
        pagination.page = 1;
        list.value = [];
        loadData();
      }
    );

    onMounted(() => {
      loadData();
    });

    function selectMainStar(item) {
      const index = list.value.findIndex((v) => v.id === item.id);
      if (index !== -1) {
        list.value.splice(index, 1);
        main_star_filters.value.push({
          ...item,
          from_index: index,
        });
      }
    }

    function unSelectMainStar(item) {
      const index = main_star_filters.value.findIndex((v) => v.id === item.id);
      if (index !== -1) {
        main_star_filters.value.splice(index, 1);
        list.value.splice(item.from_index, 0, item);
      }
    }

    return {
      Search,
      loadData,
      list,
      search_main_star,
      main_star_filters,
      selectMainStar,
      unSelectMainStar,
    };
  },
});
</script>
<style lang="less" scoped>
.infinite-list {
  height: 300px;
  width: 160px;
  padding: 0;
  margin: 0;
  list-style: none;
  margin-top: 10px;

  .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
    &:first-child {
      margin-top: 0;
    }
    & + .list-item {
      margin-top: 10px;
    }
  }
}

.main-star {
  width: 360px;
  min-height: 40px;
  display: flex;
  .search-area {
    width: 160px;
    .search-input {
      width: 150px;
      margin: 0 10px;
    }
    ::v-deep(.el-input-group__append) {
      padding: 0 5px;
    }
  }
  .show-area {
    margin-left: 15px;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .infinite-list {
      margin-top: 0;
      height: 340px;
    }
  }
}
</style>
