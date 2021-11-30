<template>
    <el-divider class="movie-divider" content-position="left">剧集</el-divider>
    <div class="movie-series">
        <div class="series-item">
            <div class="series-content">
                <div
                    class="content-item"
                    v-for="item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]"
                    :key="item"
                >
                    <el-image :src="yr"></el-image>
                    <div class="content-title">
                        <span class="content-name">锦州战场</span>
                        <span class="content-ep">第一集</span>
                    </div>
                </div>
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
            .content-item {
                float: left;
                width: 100px;
                margin: 10px;
                font-size: 14px;
                text-align: center;
                &.no-image {
                    .el-image {
                        display: none;
                    }
                    .content-name {
                        display: none;
                    }
                    .content-ep {
                        border: 1px solid #dbdbfd;
                        background-color: #f4f4f5;
                        padding: 5px;
                        color: #000;
                        border-radius: 2px;
                        width: 70px;
                        cursor: pointer;
                    }
                }
                .el-image {
                    overflow: inherit;
                    border-radius: 4px;
                }
                &:after {
                    content: "";
                    display: block;
                    clear: both;
                }
            }
            .content-name {
                display: block;
                margin-top: 5px;
            }
            .content-ep {
                margin-top: 5px;
                font-size: 14px;
                display: block;
            }
        }
    }
}
</style>