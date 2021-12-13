import store from '@/store'

/**
 * 显示上下文菜单
 * @param lib 
 * @returns 
 */
export async function showContextMenu(event: any) {
    store.dispatch('invokeMainAction', {
        action: 'showContextMenu',
        options: {
            point: {
                x: event.clientX,
                y: event.clientY
            }
        },
        await_complete: false
    })
}


/**
 * 显示搜索范围菜单
 * @param lib 
 * @returns 
 */
export async function showSearchAreaMenu(event: any) {
    return await store.dispatch('invokeMainAction', {
        action: 'showSearchAreaMenu',
        options: {
            point: {
                x: event.clientX,
                y: event.clientY
            }
        }
    })
}

/**
 * 显示列表对象菜单
 * @param event 
 * @returns 
 */
export async function showMovieItemMenu(event: any, item: any) {
    return await store.dispatch('invokeMainAction', {
        action: 'showMovieItemMenu',
        options: {
            point: {
                x: event.clientX,
                y: event.clientY
            },
            item: {
                id: item.id,
                fid: item.fid,
                imdb_id: item.imdb_id,
                media_lib_id: item.media_lib_id,
                name_cn: item.name_cn,
                year: item.year,
                language: item.language
            }
        },
        await_complete: true
    })
}
/**
 * 库菜单元素上下文菜单
 * @param event 
 * @param item 
 * @returns 
 */
export async function showLibMenu(event: any, item: any) {
    return await store.dispatch('invokeMainAction', {
        action: 'showLibMenu',
        options: {
            point: {
                x: event.clientX,
                y: event.clientY
            },
            item: {
                id: item.id,
                name: item.name,
            }
        },
        await_complete: true
    })
}