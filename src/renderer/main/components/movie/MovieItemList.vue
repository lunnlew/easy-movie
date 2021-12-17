<template>
    <div class="movie-poster" v-if="movies.length > 0">
        <table frame="void" rules="none">
            <thead>
                <tr>
                    <th class="name_cn">电影名</th>
                    <th class="name_en">别名</th>
                    <th class="type">类别</th>
                    <th class="duration">时长(分钟)</th>
                    <th class="imdb_rating">评分</th>
                    <th class="year">发布年份</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="movie-poster-item"
                    v-for="item of movies"
                    :key="item.id"
                    @click="toDetail(item.id)"
                    @contextmenu.prevent="showMovieItemMenuClick($event, item)"
                >
                    <td class="name_cn">{{ item.name_cn }}</td>
                    <td class="name_en">{{ item.name_en }}</td>
                    <th class="type">{{ fmt_genres(item.genres, 2) }}</th>
                    <td class="duration">{{ item.duration }}</td>
                    <td class="imdb_rating">{{ item.imdb_rating }}</td>
                    <td class="year">{{ item.year }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Search, Edit } from "@element-plus/icons";
import {
    movies, remove_movie, show_movie_edit, show_scraper_search
} from "@/lib/movieList";
import fmt_genres from "@/utils/genres";
import { showMovieItemMenu } from "@/lib/contextMenu";
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
            movies,
            fmt_genres
        }
    },
});
</script>
<style lang="less" scoped>
.movie-poster {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: 10px 12px;
    box-sizing: border-box;
}
table {
    color: #fff;
    width: 100%;
    font-size: 14px;
    th {
        text-align: left;
        padding: 5px;
    }
    td {
        text-align: left;
        padding: 5px;
    }
    tbody {
        tr {
            &:hover {
                background-color: #545c64;
            }
        }
    }
    .name_cn {
        max-width: 100px;
    }
    .name_en {
        max-width: 100px;
    }
    .type {
        max-width: 75px;
        display: -webkit-box !important;
        overflow: hidden;
    }
}
</style>