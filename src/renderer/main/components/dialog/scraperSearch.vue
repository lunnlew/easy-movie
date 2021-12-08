<template>
    <el-dialog
        v-model="dialogVisible"
        :width="'70%'"
        :title="'刮削搜索(' + item.name + ';' + item.year + ')'"
        @close="$emit('hide')"
    >
        <el-form ref="form" :model="libform" label-width="0px">
            <el-form-item>
                <el-input v-model="libform.name" placeholder="请输入关键字">
                    <template #append>
                        <el-button @click.stop="search" :loading="searchloading">
                            <el-icon>
                                <Search />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-table
                ref="singleTable"
                :default-sort="{ prop: 'year', order: 'descending' }"
                highlight-current-row
                :data="tableData"
                style="width: 100%"
                :empty-text="'无数据'"
                @current-change="handleCurrentChange"
            >
                <el-table-column prop="title" label="名称" width="340">
                    <template #default="scope">
                        <el-tooltip
                            placement="top"
                        >{{ scope.row.title }}-{{ scope.row.original_title }}</el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="year" label="发行年份" width="90" />
                <el-table-column prop="lang" label="语言">
                    <template #default="scope">{{ fmt_lang(scope.row.lang) }}</template>
                </el-table-column>
                <el-table-column label="是否选择">
                    <template #default="scope">
                        <el-icon v-if="scope.row.id === currentRow.id">
                            <Check />
                        </el-icon>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item style="text-align: right;margin-top: 20px;">
                <el-button size="medium" type="primary" :disabled="!currentRow.title" @click="onSubmit">
                    <span v-if="currentRow.title">已选择({{ currentRow.year || '年份未知' }})</span>
                    <span v-else>未选择</span>
                </el-button>
                <el-button size="medium" @click="$emit('hide')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import store from '@/store';
import fmt_lang from '@/utils/langs';
import { Search, Check } from '@element-plus/icons'
import {
    defineComponent,
    onMounted,
    reactive,
    ref
} from "vue";
export default defineComponent({
    name: "ScraperSearch",
    components: { Search, Check },
    emits: ["hide"],
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    setup: (props, { emit }) => {
        const dialogVisible = ref(true)

        async function search() {
            searchloading.value = true
            store.dispatch("scraper_search", {
                name: libform.name
            }).then(data => {
                searchloading.value = false
                tableData.value.splice(0, tableData.value.length, ...data.map((item: any) => {
                    return {
                        ...item,
                        year: item.release_date?.substr(0, 4),
                        lang: item.original_language
                    }
                }))
                const defal = tableData.value.find((v: any) => v.year === item.year)
                if (defal) {
                    currentRow.value = defal
                    setCurrent(defal)
                }
            }).catch(err => {
                console.log(err)
                searchloading.value = false
            })
        }

        onMounted(() => {
            search()
        })

        const item = reactive(props.data)
        const libform = reactive({
            name: item.name,
            type: 'movie'
        })

        async function onSubmit() {
            if (!currentRow.value?.title) {
                return
            }
            await store.dispatch("scraper_selected", {
                type: libform.type,
                current: item,
                imdb_movie: currentRow.value,
            })
            emit('hide')
        }
        const tableData = ref<any>([])
        const currentRow = ref<any>({})
        function handleSelected(index: any, row: any) {
            currentRow.value = row
            setCurrent(row)
        }
        const singleTable = ref<any>(null)
        function setCurrent(row: any) {
            singleTable.value?.setCurrentRow(row)
        }
        function handleCurrentChange(val: any) {
            currentRow.value = val
        }
        const searchloading = ref(false)
        return {
            onSubmit,
            libform,
            item,
            tableData,
            fmt_lang,
            search,
            setCurrent,
            currentRow,
            handleCurrentChange,
            handleSelected,
            dialogVisible,
            searchloading
        }
    }
})
</script>