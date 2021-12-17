<template>
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
                    :alt="item.name_cn"
                    @error="
                        () => {
                            item.poster = empty_poster;
                        }
                    "
                >
                    <template #placeholder>
                        <div class="image-slot">
                            <img class="el-image__inner" :src="empty_poster" :alt="item.name_cn" />
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
                        {{ item.name_cn }}
                        <span
                            class="movie-year"
                            v-if="item.year"
                        >({{ item.year }})</span>
                    </span>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import empty_poster from "@/assets/empty_poster.png";
import { Search, Edit } from "@element-plus/icons";
import { showMovieItemMenu } from "@/lib/contextMenu";
import {
    remove_movie,
    movies,
    show_movie_edit,
    show_scraper_search
} from "@/lib/movieList";
export default defineComponent({
    props: {
        toDetail: {
            type: Function,
            required: true,
        },
        show_scraper_search: {
            type: Function,
            required: true,
        },
        show_movie_edit: {
            type: Function,
            required: true,
        },
    },
    components: {
        Search,
        Edit,
    },
    setup() {
        const cardBodyStyle = {
            padding: "0px",
        };

        // 列表元素右键菜单操作
        async function showMovieItemMenuClick(event: MouseEvent, item: any) {
            const result = await showMovieItemMenu(event, item);
            if (result.action == "remove" && result.state == "success") {
                remove_movie(item);
            } else if (result.action == "edit" && result.state == "success") {
                show_movie_edit(item);
            } else if (result.action == "scraper" && result.state == "success") {
                show_scraper_search(item);
            }
        }
        return {
            showMovieItemMenuClick,
            empty_poster,
            cardBodyStyle,
            movies
        }
    },
});
</script>
<style lang="less" scoped>
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
            &:hover {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
                .op-shade {
                    display: block;
                }
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
</style>