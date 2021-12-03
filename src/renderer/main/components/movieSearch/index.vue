<template>
    <div class="lib-search-form">
        <el-input
            size="mini"
            v-model="search_keyword"
            v-if="$route.name == 'libitem'"
            placeholder="搜索"
            style="width: 200px"
        >
            <template #prefix>
                <el-tooltip content="搜索范围" placement="bottom">
                    <el-icon class="el-input__icon" @click.stop="showSearchAreaMenuClick($event)">
                        <Search />
                        <ArrowDown />
                    </el-icon>
                </el-tooltip>
            </template>
        </el-input>
    </div>
</template>
<script lang="ts">
import {
    Search,
    ArrowDown
} from '@element-plus/icons'

import {
    defineComponent, onMounted,
} from "vue";
import { search_keyword, search_fields } from "@/lib/movieSearch"
import { showSearchAreaMenu } from "@/lib/contextMenu"
import { loadConfig } from "@/lib/config"
export default defineComponent({
    name: "ContentLayout",
    components: { Search, ArrowDown },
    setup: () => {
        async function showSearchAreaMenuClick(event: MouseEvent) {
            let result = await showSearchAreaMenu(event)
            if (result && result.field) {
                let index = search_fields.value.findIndex(field => field === result.field)
                if (index > -1 && !result.enable) {
                    search_fields.value.splice(index, 1)
                } else if (result.enable) {
                    search_fields.value.push(result.field)
                }
                search_fields.value = Array.from(new Set([...search_fields.value]))
            }
        }
        onMounted(async () => {
            const result = await loadConfig({
                type: "search_field",
            })
            search_fields.value = result.filter((item: { state: number; }) => item.state == 1).map((item: { val: any; }) => item.val)
        })
        return {
            search_keyword,
            showSearchAreaMenuClick
        }
    }
})
</script>
<style lang="less" scoped>
.lib-search-form {
    -webkit-app-region: no-drag;
    display: inline-block;
    width: 200px;
}
.lib-search-form .el-input {
    left: 5px;
    bottom: 0;
    top: -3px;
    ::v-deep(.el-input__inner) {
        height: 24px;
        line-height: 24px;
    }
}
</style>