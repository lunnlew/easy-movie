import { ref } from "vue";
import { loadConfig } from "@/lib/config";
import { dicts } from "@/utils/genres";
import { getFilters } from '@/api/filter'
import store from "@/store";

/**
 * 启用的过滤器
 */
export const filter_enables = ref([]);

/**
 * 设置启用的过滤器
 * @param filters 
 */
export function setEnableFilters(filters) {
    filter_enables.value = filters.filter(i => i.checked).map(i => i.value);
    console.log('setEnableFilters', filter_enables.value);
    return filter_enables.value
}

/**
 * 从设置页的结果中更新过滤器
 * @param val 
 */
export function changeEnableFromSetting(filters) {
    // 变更启用的过滤选项
    setEnableFilters(filters);
    // 尝试刷新类型过滤器
    refresh_filter()
    // 触发落库更改
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
 * 标签筛选
 */
export const tag_filters = ref<any[]>([]);

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
    } else if (data.type == 'tag_filter') {
        // 互斥标签处理
        if (data.key === 'watched') {
            let unwatched = tag_filters.value.find(i => i.key === 'unwatched')
            if (unwatched) {
                unwatched.disabled = data.value
            }
        } else if (data.key === 'unwatched') {
            let watched = tag_filters.value.find(i => i.key === 'watched')
            if (watched) {
                watched.disabled = data.value
            }
        }
        tag_filters.value = [...tag_filters.value]
    }
}

/**
 * 更新筛选条件展示值
 */
export async function refresh_type_filter() {
    if (filter_enables.value.includes("type_filter")) {
        // 设置改变显示时，重新加载数据
        const result = await loadConfig({
            type: "type_filter",
        })
        const count_result = await getFilters(movie_lib.value.lib_id, 'type_filter', result.map((item: any) => {
            return {
                name: dicts[item.val] || item.name,
                key: item.val
            }
        }))
        type_filters.value = result.map((item: any) => {
            return {
                name: dicts[item.val] || item.name,
                key: item.val,
                checked: item.state == 1 ? true : false,
                count: count_result.data?.data[item.val] || 0
            }
        })
    } else {
        // 设置改变隐藏时，取消所有选择
        type_filters.value = type_filters.value.map(v => ({
            ...v,
            checked: false
        }))
    }
}

/**
 * 刷新标签过滤器
 */
export async function refresh_tag_filter() {
    if (filter_enables.value.includes("tag_filter")) {
        // 设置改变显示时，重新加载数据
        const result = await loadConfig({
            type: "tag_filter",
        })
        const count_result = await getFilters(movie_lib.value.lib_id, 'tag_filter', result.map((item: any) => {
            return {
                name: item.name,
                key: item.val
            }
        }))
        let data = result.map((item: any) => {
            return {
                name: item.name,
                key: item.val,
                disabled: 0,
                checked: item.state == 1 ? true : false,
                count: count_result.data?.data[item.val] || 0
            }
        })
        for (let item of data) {
            if (item.key === 'watched') {
                let unwatched = data.find(i => i.key === 'unwatched')
                if (unwatched) {
                    unwatched.disabled = item.checked
                }
            } else if (data.key === 'unwatched') {
                let watched = data.find(i => i.key === 'watched')
                if (watched) {
                    watched.disabled = item.checked
                }
            }
        }
        tag_filters.value = data
    } else {
        // 设置改变隐藏时，取消所有选择
        tag_filters.value = tag_filters.value.map(v => ({
            ...v,
            checked: false
        }))
    }
}

/**
 * 刷新过滤器
 */
export function refresh_filter() {
    // 刷新类型过滤器
    refresh_type_filter()
    // 刷新标签过滤器
    refresh_tag_filter()
}

/**
 * 清除筛选条件
 */
export async function clear_filter() {
    // type_filters.value = []
}

/**
 * 启用的排序字段
 */
export const movie_sort_field = ref([])

/**
 * 启用的排序类型
 */
export const movie_sort_type = ref([])

/**
 * 更改排序
 * @param params 
 */
export async function changeSort(params: any) {
    if (params.action == 'sort_field') {
        const index = movie_sort_field.value.find(v => v.field === params.field)
        if (index > -1 && !params.enable) {
            movie_sort_field.value.splice(index, 1)
        } else {
            movie_sort_field.value = [params]
        }
    } else if (params.action == 'sort_type') {
        const index = movie_sort_type.value.find(v => v.field === params.field)
        if (index > -1 && !params.enable) {
            movie_sort_type.value.splice(index, 1)
        } else {
            movie_sort_type.value = [params]
        }
    }
}

// 是否加载筛选工具配置完成
export const loadedTypeFilterConfig = ref(false)

// 是否加载排序工具配置完成
export const loadedSortConfig = ref(false)