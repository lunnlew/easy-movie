<template>
    <div class="movie-filter" :style="{
        height: (isShowFilter ? 40 : 0) + 'px'
    }">
        <div class="filter-items">
            <span class="filter-item">
                <type-filter @filter="changeFilter"></type-filter>
            </span>
        </div>
    </div>
</template>
<script lang="ts">
import {
    defineComponent, onMounted, watch,
} from "vue";
import {
    CircleCheck,
    Check,
    CirclePlus,
    CirclePlusFilled,
    Plus,
} from '@element-plus/icons'
import { isShowFilter, changeFilter, clear_filter, refresh_filter, movie_lib } from '@/lib/movieFilter'
import typeFilter from './filters/type_filter.vue'
export default defineComponent({
    name: "MovieFilter",
    components: {
        typeFilter
    },
    setup: (props) => {
        watch(() => isShowFilter.value, (val) => {
            if (val) {
                refresh_filter()
            } else {
                clear_filter()
            }
        })
        watch(() => movie_lib.value, (val) => {
            if (isShowFilter.value) {
                refresh_filter()
            }
        })
        onMounted(async () => {
            refresh_filter()
        })
        return {
            changeFilter,
            CircleCheck,
            Check,
            CirclePlus,
            CirclePlusFilled,
            Plus,
            isShowFilter
        }
    },
});
</script>
<style lang="less">
.movie-filter {
    overflow: auto;
    height: 40px;
    position: fixed;
    z-index: 100;
    background: #525252;
    transition: height 0.2s ease;
    width: 100%;
}
.filter-items {
    padding: 10px 15px;
}
/**
.el-popper 这里需全局覆写，可能会导致其他使用的出现问题，暂时这样使用
 */
.el-popper {
    border: none !important;
    margin-top: -5px !important;
    border-radius: 5px;
    .el-popper__arrow {
        display: none;
    }
    .el-checkbox__inner {
        background-color: #5d5e5f !important;
    }
    .el-checkbox__label {
        color: #fff !important;
        font-size: 12px;
    }
    .el-dropdown__popper {
        padding: 1px 10px !important;
    }
}
.el-dropdown-menu {
    background: #5d5e5f !important;
    border-radius: 3px;
}
.filter-ui {
    padding: 5px 0;
    .filter-ui-item {
        padding: 5px 10px;
        width: 140px;
        &:hover {
            background: #525252;
        }
        .el-checkbox__label {
            width: 115px;
        }
        .el-checkbox.el-checkbox--mini {
            height: 18px !important;
        }
        .name {
            font-size: 14px;
            color: #fff;
        }
        .count {
            font-size: 13px;
            color: #fff;
            right: 0;
            position: absolute;
            vertical-align: middle;
            line-height: 15px;
        }
    }
}
.filter-item {
    color: #fff;
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
    .el-dropdown {
        color: #fff;
        font-size: 12px;
    }
    &:hover {
        background: #666;
    }
    &.active {
        background: #666;
    }
    .el-icon {
        padding-left: 1px;
        display: inline-block;
        vertical-align: middle;
        border-radius: 3px;
    }
    .filters {
        max-width: 96px;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        white-space: nowrap;
        display: table-cell;
    }
}
</style>