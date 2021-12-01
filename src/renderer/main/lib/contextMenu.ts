import store from '@/store'

/**
 * 显示上下文菜单
 * @param lib 
 * @returns 
 */
export async function showContextMenu(event: any) {
    return await store.dispatch('invokeMainAction', {
        action: 'showContextMenu',
        options: {
            point: {
                x: event.clientX,
                y: event.clientY
            }
        }
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