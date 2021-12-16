
import { getMovies } from "@/api/movie";
import { reactive, ref } from "vue";
import { search_keyword, search_fields } from "./movieSearch";
import { isShowFilter, type_filters, movie_lib, main_star_filters, movie_sort_field, movie_sort_type } from "./movieFilter";
import { MovieInfo } from '@/types/all'

/**
 * 电影列表
 */
export const movies = ref<MovieInfo[]>([])

/**
 * 分页信息
 */
export const pagination = reactive({
    /**
     * 当前页数
     */
    page: 1,
    /**
     * 每页显示数量
     */
    size: 50
})

/**
 * 更新分页参数
 * @param page 
 * @param size 
 */
export async function updatePagination(page = 1, size = 50) {
    pagination.page = page
    pagination.size = size
}

/**
 * 筛选条件变化时更新列表
 */
export async function onFilterChange() {
    updatePagination(1, 50)
    const res = await getMovies({
        pagination,
        search: {
            value: search_keyword.value,
            fields: search_fields.value
        },
        filters: {
            media_lib_id: movie_lib.value.lib_id,
            actors: ['in', isShowFilter.value ? main_star_filters.value.map(v => v.id) : []],
            genres: ['like', isShowFilter.value ? type_filters.value.filter(v => v.checked).map(v => v.name) : []]
        },
        sort: {
            sort_field: movie_sort_field.value.filter(v => v.enable).map(v => v.field).join(',') || 'id',
            sort_order: movie_sort_type.value.filter(v => v.enable).map(v => v.field).join(',') || 'asc',
        }
    })
    const data = res.data?.data || []
    const movie_new_ids = new Set(data.map((v: { id: any; }) => v.id))
    const movie_old_ids = movies.value.map((v: { id: any; }) => v.id)
    const intersect = new Set([...movie_old_ids].filter(x => movie_new_ids.has(x)));
    for (const item of data) {
        if (!intersect.has(item.id)) {
            movies.value.push(item)
        }
    }
    movies.value = movies.value.filter((v: { id: any; }) => movie_new_ids.has(v.id))
}

/**
 * 滚动变化时更新列表
 */
export async function onScrollEndChange() {
    updatePagination(pagination.page++, 50)
    const res = await getMovies({
        pagination,
        search: {
            value: search_keyword.value,
            fields: search_fields.value
        },
        filters: {
            media_lib_id: movie_lib.value.lib_id,
            genres: ['like', isShowFilter.value ? type_filters.value.filter(v => v.checked).map(v => v.name) : []]
        },
        sort: {
            sort_field: "id",
            sort_order: "asc"
        }
    })
    if (res.data.data.length === 0) {
        pagination.page--
        showEmptyDisplay.value = 'block'
    } else {
        showEmptyDisplay.value = 'none'
    }
}

/**
 * 要刮削的影片目标
 */
export const scraper_search_item = ref<MovieInfo>()

/**
 * 显示刮削界面
 */
export const showScraperSearchDialog = ref(false)

/**
 * 是否显示空结果
 */
export const showEmptyDisplay = ref('none')

/**
 * 是否显示影视编辑界面
 */
export const showEditDialog = ref(false)

/**
 * 暂存的影视编辑信息
 */
export const edit_item = ref<MovieInfo>()

/**
 * 准备刮削目标及显示界面
 * @param item 
 */
export function show_scraper_search(item: any) {
    scraper_search_item.value = {
        ...item,
        media_lib_id: movie_lib.value.lib_id
    }
    showScraperSearchDialog.value = true
}

/**
 * 准备影片编辑数据及显示界面
 * @param item 
 */
export function show_movie_edit(item: any) {
    edit_item.value = {
        ...item,
        media_lib_id: item.media_lib_id !== '' ? parseInt(item.media_lib_id) : ''
    }
    showEditDialog.value = true
}

/**
 * 编辑保存后刷新页面中的数据
 * @param data 
 */
export function refresh_movie_edit(data: any) {
    const { act, item } = data
    showEditDialog.value = false
    if (act === 'move' && movie_lib.value.lib_id !== '') {
        movies.value = movies.value.filter((movie: any) => movie.id !== item.id)
    } else {
        const index = movies.value.findIndex((movie: any) => movie.id === item.id)
        if (index !== -1) {
            movies.value.splice(index, 1, {
                ...movies.value[index],
                ...item
            })
        }
    }
}

/**
 * 列表页影视信息更新方法
 * @param item 
 * @returns 
 */
export function update_movie(item: any) {
    if (!item) {
        return
    }
    const index = movies.value.findIndex(m => m.id === item.id)
    if (index === -1) {
        movies.value.unshift(item)
    } else {
        movies.value[index] = {
            ...movies.value[index],
            ...item
        }
    }
}

/**
 * 列表页影视信息更新方法
 * @param item 
 * @returns 
 */
export function remove_movie(item: any) {
    if (!item) {
        return
    }
    const index = movies.value.findIndex(m => m.id === item.id)
    if (index !== -1) {
        movies.value.splice(index, 1)
    }
}