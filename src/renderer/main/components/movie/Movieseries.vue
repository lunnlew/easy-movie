<template>
    <el-divider class="movie-divider" content-position="left">剧集/季目</el-divider>
    <div class="movie-series">
        <div class="series-item">
            <div class="series-title">
                <span class="series-name">第一季</span>
                <span class="series-year">(2020)</span>
            </div>
            <div class="series-content">
                <el-image v-for="item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" :key="item" :src="yr"></el-image>
            </div>
        </div>
        <div class="series-item">
            <div class="series-title">
                <span class="series-name">第二季</span>
                <span class="series-year">(2020)</span>
            </div>
            <div class="series-content">
                <el-image v-for="item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" :key="item" :src="yr"></el-image>
            </div>
        </div>
        <div class="series-item">
            <div class="series-title">
                <span class="series-name">第三季</span>
                <span class="series-year">(2020)</span>
            </div>
            <div class="series-content">
                <el-image v-for="item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" :key="item" :src="yr"></el-image>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
} from "vue";
import yr from "@/assets/p1473419503.28.jpg";
export default defineComponent({
    name: "MovieDetail",
    components: {},
    setup: () => {
        return {
            yr
        }
    },
});
</script>
<style lang="less" scoped>
.movie-series {
    color: #fff;
    .series-item {
        .series-title {
            .series-name {
                font-size: 20px;
                color: #fff;
            }
            .series-year {
                padding-left: 10px;
                font-size: 12px;
                color: #fff;
            }
        }
        .series-content {
            padding: 0 12px;
            .el-image {
                float: left;
                width: 100px;
                margin: 10px;
                overflow: inherit;
                border-radius: 4px;
            }
            &:after {
                content: "";
                display: block;
                clear: both;
            }
        }
    }
}
</style>