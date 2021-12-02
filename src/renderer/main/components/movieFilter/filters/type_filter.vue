<template>
    <el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link">
            <span>类型</span>
            <span
                class="filters"
                v-if="type_filters.filter(v => v.checked).length > 0"
            >:{{ type_filters.filter(v => v.checked).map(v => v.name).join(',') }}</span>
            <el-icon size="12">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu v-if="type_filters.length">
                <div class="filter-ui">
                    <div class="filter-ui-item" v-for="item of type_filters" :key="item.key">
                        <el-checkbox
                            size="mini"
                            v-model="item.checked"
                            :checked="item.checked"
                            @change="(checked) => $emit('filter', {
                                type: 'type',
                                name: item.key,
                                value: checked
                            })"
                        >
                            <span class="name">{{ item.name }}</span>
                            <span class="count">{{ item.count }}</span>
                        </el-checkbox>
                    </div>
                </div>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts">
import {
    defineComponent,
} from "vue";
import {
    ArrowDown,
} from '@element-plus/icons'
import { type_filters } from '@/lib/movieFilter'
export default defineComponent({
    name: "MovieFilter",
    emits: ['filter'],
    components: {
        ArrowDown,
    },
    setup: (props, { emit }) => {
        return {
            type_filters
        }
    },
});
</script>
<style lang="less">
</style>