import { ref } from "vue";
import { loadConfig } from "@/lib/config";
import { dicts } from "@/utils/genres";
import { getFilters } from '@/api/filter'
import store from "@/store";

/**
 * 是否启用筛选工具
 */
export const isShowFilter = ref(false);

/**
 * 类型筛选
 */
export const type_filters = ref<any[]>([]);

/**
 * 当前的媒体库ID
 */
export const movie_lib = ref({
    lib_id: "",
    lib_name: "",
    lib_path: "",
});

/**
 * 筛选工具显示切换
 */
export function toggleFilterTool() {
    isShowFilter.value = !isShowFilter.value;
};

/**
 * 筛选条件变化监听处理
 * @param data 
 */
export async function changeFilter(data: any) {
    store.dispatch('invokeMainAction', {
        action: 'setFilterData',
        options: data
    })
    type_filters.value = [...type_filters.value]
}

/**
 * 更新筛选条件展示值
 */
export async function refresh_filter() {
    getFilters(movie_lib.value.lib_id, 'type', type_filters.value.map(i => ({
        name: i.name,
        key: i.key
    }))).then(async res => {
        const result = await loadConfig({
            type: "type_filter",
        })
        type_filters.value = result.map((item: any) => {
            return {
                name: dicts[item.val] || item.name,
                key: item.val,
                checked: item.state == 1 ? true : false,
                count: res.data?.data[item.val] || 0
            }
        })
    })
}

/**
 * 清除筛选条件
 */
export async function clear_filter() {
    // type_filters.value = []
}