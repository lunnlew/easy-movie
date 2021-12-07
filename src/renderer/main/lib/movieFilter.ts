import { ref } from "vue";
import { loadConfig } from "@/lib/config";
import { dicts } from "@/utils/genres";
import { getFilters } from '@/api/filter'
import store from "@/store";

/**
 * 启用的过滤器
 */
export const filter_enables = ref(['type_filter']);

/**
 * 从设置页的结果中更新过滤器
 * @param val 
 */
export function changeEnableFromSetting(filters) {
    filter_enables.value = filters.filter(i => i.checked).map(i => i.value);
    store.dispatch('invokeMainAction', {
        action: 'setFilterSetting',
        options: filters,
        await_complete: false
    })
}

/**
 * 是否启用筛选工具
 */
export const isShowFilter = ref(false);

/**
 * 类型筛选
 */
export const type_filters = ref<any[]>([]);

/**
 * 主演筛选
 */
export const main_star_filters = ref<any[]>([]);

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
        options: data,
        await_complete: false
    })
    if (data.type == 'type_filter') {
        type_filters.value = [...type_filters.value]
    } else if (data.type == 'main_star_filter') {
        main_star_filters.value = [...main_star_filters.value]
    }
}

/**
 * 更新筛选条件展示值
 */
export async function refresh_filter() {
    // 类型筛选
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

    await loadConfig({
        type: "filter_setting",
    }).then(result => {
        changeEnableFromSetting(result.map((item: any) => {
            return {
                label: item.name,
                value: item.val,
                checked: item.state == 1 ? true : false
            }
        }))
    })
}

/**
 * 清除筛选条件
 */
export async function clear_filter() {
    // type_filters.value = []
}