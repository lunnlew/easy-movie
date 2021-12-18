<template>
  <div class="movie-detail">
    <div class="movie-head">
      <div class="movie-left">
        <div class="movie-poster">
          <el-card :body-style="cardBodyStyle">
            <el-image
              :src="setImgUrlPrex(movieInfo.poster)"
              :alt="movieInfo.name_cn"
              @error="
                () => {
                  movieInfo.poster = empty_poster;
                }
              "
            >
              <template #placeholder>
                <div class="image-slot">
                  <img class="el-image__inner" :src="empty_poster" :alt="movieInfo.name_cn" />
                </div>
              </template>
            </el-image>
          </el-card>
        </div>
      </div>
      <div class="movie-right">
        <div class="movie-name">
          {{ movieInfo.name_cn }}
          <span
            class="movie-year"
            v-if="movieInfo.year"
          >({{ movieInfo.year }})</span>
          <span class="lib-name">位置：{{ libName }}</span>
        </div>
        <div class="movie-body">
          <div class="movie-info">
            <div class="info-item" v-if="directs.length">
              导演:
              <span>{{ directs.map((d) => d.name_cn).join(",") }}</span>
            </div>
            <div class="info-item" v-if="edits.length">
              编剧:
              <span>{{ edits.map((d) => d.name_cn).join(",") }}</span>
            </div>
            <div class="info-item" v-if="actors.length">
              主演:
              <span>{{ main_actors.map((d) => d.name_cn).join(",") }}</span>
            </div>
            <div class="info-item" v-if="movieInfo.genres">
              类型:
              <span>{{ fmt_genres(movieInfo.genres) }}</span>
            </div>
            <div class="info-item">
              制片国家/地区:
              <span>{{ fmt_contry(movieInfo.country) }}</span>
            </div>
            <div class="info-item">
              语言:
              <span>{{ fmt_lang(movieInfo.language) }}</span>
            </div>
            <div class="info-item">
              上映日期:
              <span>{{ movieInfo.release_date }}</span>
            </div>
            <div class="info-item" v-if="movieInfo.duration">
              片长:
              <span>{{ movieInfo.duration }} 分钟</span>
            </div>
            <div class="info-item" v-if="movieInfo.original_title">
              又名:
              <span>{{ movieInfo.original_title }}</span>
            </div>
            <div class="info-item">
              IMDb:
              <span>{{ movieInfo.imdb_id }}</span>
            </div>
          </div>
          <div class="movie-summary">
            <div class="group-title">剧情简介</div>
            <p class="group-content desc-content">{{ movieInfo.summary }}</p>
            <div class="group-title">演职员</div>
            <p class="group-content actor-list">
              <el-image v-for="item of actors" :key="item.id" :src="item.avatar" :alt="item.name"></el-image>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <tv-series></tv-series> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, watch, ref, computed } from "vue";
import empty_poster from "@/assets/empty_poster.png";
// import TvSeries from "./TVseries.vue"
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { MovieInfo } from "@/types/all";
import fmt_genres from "@/utils/genres";
import fmt_contry from "@/utils/contries";
import fmt_lang from "@/utils/langs";
import { setImgUrlPrex } from "@/utils/util";
export default defineComponent({
  name: "MovieDetail",
  // components: { TvSeries },
  setup: () => {
    const route = useRoute();
    const store = useStore();
    const movieInfo = ref<MovieInfo>({
      media_lib_id: "",
      id: 0,
      poster: "",
      name_cn: "",
      name_en: "",
      year: "",
      summary: "",
      release_date: "",
      imdb_rating: 0,
      duration: 0,
      original_title: "",
      genres: "",
      country: "",
      language: "",
      imdb_id: "",
    });
    const actors = ref<any[]>([]);
    const directs = ref<any[]>([]);
    const edits = ref<any[]>([]);
    const libInfo = computed(
      () =>
        store.state.Libs.libs.find(
          (lib: any) => lib.id + "" === movieInfo.value.media_lib_id
        ) || {}
    );

    async function freshMovieInfo() {
      if (route.params.movieId) {
        movieInfo.value = await store.dispatch(
          "getMovieInfo",
          route.params.movieId
        );
        let ractors = await store.dispatch("getMovieActorsInfo", {
          movieId: route.params.movieId,
          job: "Actor",
          size: 20,
        });
        actors.value = ractors.filter((item: { avatar: any }) => item.avatar);
        directs.value = await store.dispatch("getMovieActorsInfo", {
          movieId: route.params.movieId,
          job: "Director",
          size: 5,
        });
        edits.value = await store.dispatch("getMovieActorsInfo", {
          movieId: route.params.movieId,
          job: "Writer",
          size: 5,
        });
      }
    }
    watch(() => route.params.movieId, freshMovieInfo);
    onMounted(() => {
      freshMovieInfo();
    });
    const cardBodyStyle = {
      padding: "0px",
    };
    let main_actors = computed(() =>
      actors.value.filter((v, index) => v && index < 4)
    );

    let libName = computed(() => {
      if (!libInfo.value.name || libInfo.value.name == "all") {
        return "全部";
      } else {
        return libInfo.value.name;
      }
    });

    return {
      empty_poster,
      fmt_genres,
      fmt_contry,
      fmt_lang,
      movieInfo,
      actors,
      main_actors,
      directs,
      edits,
      cardBodyStyle,
      libName,
      setImgUrlPrex
    };
  },
});
</script>
<style lang="less" scoped>
.movie-detail {
  padding: 20px;
  box-sizing: border-box;
  .movie-head {
    display: flex;
    width: 100%;
    height: 100%;
    .movie-left {
      width: 260px;
      .movie-poster {
        width: 260px;
        height: auto;
        .el-image {
          overflow: inherit;
          border-radius: 4px;
          background: #909399;
        }
        .el-image__error {
          min-height: 300px;
        }
        .el-card {
          position: relative;
          border: none;
        }
        &:hover {
          .el-card {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .movie-right {
      flex: 1;
      color: #fff;
      font-size: 14px;
      .movie-name {
        padding: 20px 0 20px 20px;
        font-size: 26px;
        color: #fff;
        position: relative;
        .movie-year {
          font-size: 12px;
          color: #fff;
        }
        .lib-name {
          right: 30px;
          position: absolute;
          font-size: 14px;
          bottom: 0;
        }
      }

      .movie-body {
        display: flex;

        .movie-info {
          width: 280px;
          padding: 0 20px;
          box-sizing: border-box;
          .info-item {
            font-size: 14px;
            padding: 3px 0;
            color: #fff;
            span {
              margin: 0 2px;
            }
          }
        }

        .movie-summary {
          flex: 1;
          .group-title {
            margin-top: 30px;
            &:first-child {
              margin-top: 3px;
            }
          }
          .group-content {
            margin-top: 10px;
            line-height: 1.5;
          }
          .desc-content {
            display: -webkit-box !important;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-indent: 2em;
          }
          .actor-list {
            padding: 0 12px;
            height: 150px;
            overflow: hidden;
            .el-image {
              float: left;
              width: 100px;
              margin: 10px;
            }
          }
        }
      }
    }
  }
  .movie-divider {
    ::v-deep(.el-divider__text) {
      border-radius: 2px;
    }
  }
}
</style>
