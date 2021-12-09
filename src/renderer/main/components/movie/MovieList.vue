<template>
  <movie-filter></movie-filter>
  <div
    class="movie-list"
    :style="{
      transform: isShowFilter ? ' translateY(40px)' : 'translateY(0px)',
    }"
  >
    <div class="movie-poster" v-if="movies.length > 0">
      <div
        class="movie-poster-item"
        v-for="item of movies"
        :key="item.id"
        @contextmenu.prevent="showMovieItemMenuClick($event, item)"
      >
        <el-card
          :body-style="cardBodyStyle"
          @click="toDetail(item.id)"
          :class="{ noimg: !item.poster }"
        >
          <el-image
            lazy
            :src="item.poster"
            :alt="item.name"
            @error="
              () => {
                item.poster = empty_poster;
              }
            "
          >
            <template #placeholder>
              <div class="image-slot">
                <img
                  class="el-image__inner"
                  :src="empty_poster"
                  :alt="item.name"
                />
              </div>
            </template>
          </el-image>
          <div class="op-shade">
            <div class="btn-edit">
              <el-tooltip content="编辑" placement="bottom">
                <el-button
                  type="text"
                  size="mini"
                  circle
                  @click.stop="show_movie_edit(item)"
                >
                  <el-icon :color="'#f0f2f5'">
                    <Edit />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>
            <div class="btn-fetch">
              <el-tooltip content="重新抓取" placement="bottom">
                <el-button
                  type="text"
                  size="mini"
                  circle
                  @click.stop="show_scraper_search(item)"
                >
                  <el-icon :color="'#f0f2f5'">
                    <Search />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="play-shade">
            <el-icon :size="40" :color="'#fff'" @click="toDetail(item.id)">
              <video-play />
            </el-icon>
          </div>
          <div class="movie-info">
            <span class="movie-name">
              {{ item.name }}
              <span class="movie-year" v-if="item.year">({{ item.year }})</span>
            </span>
          </div>
        </el-card>
      </div>
    </div>
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
import empty_poster from "@/assets/empty_poster.png";
import { useRouter } from "vue-router";
import { Search, Edit } from "@element-plus/icons";
import ScraperSearch from "@/components/dialog/scraperSearch.vue";
import { showMovieItemMenu } from "@/lib/contextMenu";
import MovieEdit from "@/components/dialog/movieEdit.vue";
import movieFilter from "@/components/movieFilter/index.vue";
import { useStore } from "vuex";
import { isShowFilter, type_filters, movie_lib } from "@/lib/movieFilter";
import { search_keyword, search_fields } from "@/lib/movieSearch";
import {
  movies,
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
  remove_movie,
} from "@/lib/movieList";
export default defineComponent({
  name: "MovieList",
  components: {
    Search,
    Edit,
    MovieEdit,
    ScraperSearch,
    movieFilter,
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
    const cardBodyStyle = {
      padding: "0px",
    };
    function toDetail(movieId: any) {
      router.push({
        name: "MovieDetail",
        params: {
          movieId,
        },
      });
    }
    watch(
      () => search_keyword.value,
      () => {
        onFilterChange();
      }
    );
    watch(
      () => search_fields.value,
      () => {
        if (search_keyword.value) {
          onFilterChange();
        }
      }
    );
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
        onFilterChange();
      }
    );
    watch(
      () => isShowFilter.value,
      (val) => {
        onFilterChange();
      }
    );
    watch(
      () => movie_lib.value,
      () => {
        onFilterChange();
      }
    );
    watch(
      () => store.state.Libs.is_scroll_bottom_end,
      (val) => {
        if (val) {
          onScrollEndChange();
        }
      }
    );
    onMounted(() => {
      onFilterChange();
    });
    async function showMovieItemMenuClick(event: MouseEvent, item: any) {
      const result = await showMovieItemMenu(event, item);
      if (result.action == "remove" && result.state == "success") {
        remove_movie(item);
      }
    }
    return {
      empty_poster,
      cardBodyStyle,
      toDetail,
      movies,
      showScraperSearchDialog,
      show_scraper_search,
      show_movie_edit,
      refresh_movie_edit,
      edit_item,
      scraper_search_item,
      showEditDialog,
      showEmptyDisplay,
      showMovieItemMenuClick,
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
.movie-poster {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  padding: 0 12px;
  box-sizing: border-box;
  .movie-poster-item {
    flex-shrink: 0;
    width: calc((100% - 72px) / 7);
    // min-width: 60px;
    margin: 10px 0;
    margin-right: 12px; // (7-1)*12 = 72px
    &:nth-of-type(7n + 0) {
      margin-right: 0;
    }
    .el-card {
      position: relative;
      border: none;
    }
    &:hover {
      .el-card {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
      }
      // .play-shade {
      //   display: flex;
      // }
      .op-shade {
        display: block;
      }
    }
    .el-image {
      width: 100%;
      overflow: inherit;
      border-radius: 4px;
      background: #909399;
    }
    .el-image__error {
      min-height: 145px;
    }
    .noimg {
      .el-image {
        min-height: 105px;
      }
    }
    .op-shade {
      // position: absolute;
      // top: 0;
      // left: 0;
      // width: 100%;
      // height: 100%;
      // background: rgba(0, 0, 0, 0.5);
      display: none;
      // justify-content: center;
      // align-items: center;
      .btn-edit {
        position: absolute;
        top: 5px;
        left: 5px;
        margin: 0;
        padding: 0;
      }

      .btn-fetch {
        position: absolute;
        top: 5px;
        right: 5px;
        margin: 0;
        padding: 0;
      }
      .el-button {
        border-color: transparent;
        background-color: transparent;
      }
    }
    .play-shade {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      .el-icon-play-circle {
        font-size: 50px;
        color: #fff;
      }
    }
    .movie-info {
      // display: none;
      position: absolute;
      bottom: 0px;
      left: 0px;
      padding: 4px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.5);
      .movie-name {
        font-size: 14px;
        color: #fff;
      }
      .movie-year {
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
.empty-content {
  text-align: center;
}
</style>