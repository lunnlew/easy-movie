<template>
  <movie-filter></movie-filter>
  <div
    class="movie-list"
    :style="{
      transform: isShowFilter ? ' translateY(40px)' : 'translateY(0px)',
    }"
  >
    <movie-card-list
      v-if="listView === 'card'"
      :toDetail="toDetail"
      :show_scraper_search="show_scraper_search"
      :show_movie_edit="show_movie_edit"
    ></movie-card-list>
    <movie-item-list
      v-else-if="listView === 'list'"
      :toDetail="toDetail"
      :show_scraper_search="show_scraper_search"
      :show_movie_edit="show_movie_edit"
    ></movie-item-list>
    <div class="empty-content" :style="{ display: showEmptyDisplay }" v-else>
      <el-empty>
        <template #description>
          <p>暂无数据</p>
        </template>
      </el-empty>
    </div>
  </div>
  <scraper-search
    v-if="showScraperSearchDialog"
    @hide="showScraperSearchDialog = false"
    :data="scraper_search_item"
  ></scraper-search>
  <movie-edit
    v-if="showEditDialog"
    @hide="showEditDialog = false"
    @refresh="refresh_movie_edit"
    :data="edit_item"
  ></movie-edit>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import ScraperSearch from "@/components/dialog/scraperSearch.vue";
import MovieEdit from "@/components/dialog/movieEdit.vue";
import movieFilter from "@/components/movieFilter/index.vue";
import MovieCardList from "@/components/movie/MovieCardList.vue";
import MovieItemList from "@/components/movie/MovieItemList.vue";
import { useStore } from "vuex";
import {
  isShowFilter,
  type_filters,
  movie_lib,
  main_star_filters,
  movie_sort_field,
  movie_sort_type,
  loadedTypeFilterConfig,
  loadedSortConfig,
} from "@/lib/movieFilter";
import { search_keyword, search_fields } from "@/lib/movieSearch";
import {
  show_scraper_search,
  showScraperSearchDialog,
  edit_item,
  scraper_search_item,
  showEditDialog,
  showEmptyDisplay,
  show_movie_edit,
  refresh_movie_edit,
  update_movie,
  onFilterChange,
  onScrollEndChange,
} from "@/lib/movieList";
export default defineComponent({
  name: "MovieList",
  components: {
    MovieEdit,
    ScraperSearch,
    movieFilter,
    MovieCardList,
    MovieItemList
  },
  props: {
    libInfo: {
      type: Object,
      default: () => ({
        name: "all",
      }),
    },
  },
  setup: (props) => {
    const router = useRouter();
    const store = useStore();
    function toDetail(movieId: any) {
      router.push({
        name: "MovieDetail",
        params: {
          movieId,
        },
      });
    }

    const listView = computed(() => {
      return store.state.Movie.listView;
    });

    // 当配置项加载完后才允许首次的列表内容加载
    const loadedConfig = computed(
      () => loadedSortConfig.value && loadedTypeFilterConfig.value
    );
    watch(
      () => loadedConfig.value,
      (val) => {
        val && onFilterChange();
      }
    );

    // 搜索内容变更
    watch(
      () => search_keyword.value,
      () => {
        loadedConfig.value && onFilterChange();
      }
    );

    // 搜索字段变更
    watch(
      () => search_fields.value,
      () => {
        if (search_keyword.value) {
          loadedConfig.value && onFilterChange();
        }
      }
    );

    // 电影类型字段变更
    const type_filter_checked = computed(() =>
      type_filters.value
        .filter((item) => item.checked)
        .map((v) => v.key)
        .sort((v) => v)
        .join(",")
    );
    watch(
      () => type_filter_checked.value,
      () => {
        loadedConfig.value && onFilterChange();
      }
    );

    // 电影排序字段变更
    const sort_field_checked = computed(() =>
      movie_sort_field.value
        .filter((item) => item.enable)
        .map((v) => v.field)
        .sort((v) => v)
        .join(",")
    );
    watch(
      () => sort_field_checked.value,
      () => {
        loadedConfig.value && onFilterChange();
      }
    );

    // 电影排序类型变更
    const sort_type_checked = computed(() =>
      movie_sort_type.value
        .filter((item) => item.enable)
        .map((v) => v.field)
        .sort((v) => v)
        .join(",")
    );
    watch(
      () => sort_type_checked.value,
      () => {
        loadedConfig.value && onFilterChange();
      }
    );

    // 筛选工具显隐变更
    watch(
      () => isShowFilter.value,
      (val) => {
        loadedConfig.value && onFilterChange();
      }
    );

    // 媒体库变更
    watch(
      () => movie_lib.value,
      () => {
        loadedConfig.value && onFilterChange();
      }
    );

    // 滚动到底
    watch(
      () => store.state.Libs.is_scroll_bottom_end,
      (val) => {
        if (val) {
          onScrollEndChange();
        }
      }
    );

    // 演员变更
    const main_star_filter_checked = computed(() =>
      main_star_filters.value
        .map((v) => v.id)
        .sort((v) => v)
        .join(",")
    );
    watch(
      () => main_star_filter_checked.value,
      () => {
        loadedConfig.value && onFilterChange();
      }
    );

    return {
      toDetail,
      showScraperSearchDialog,
      show_scraper_search,
      show_movie_edit,
      refresh_movie_edit,
      edit_item,
      listView,
      scraper_search_item,
      showEditDialog,
      showEmptyDisplay,
      isShowFilter,
      update_movie,
    };
  },
});
</script>
<style lang="less" scoped>
.movie-list {
  // transition: transform 0.3s ease;
  height: inherit;
}
.empty-content {
  text-align: center;
}
</style>
