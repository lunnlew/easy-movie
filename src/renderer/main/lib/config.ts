import store from '@/store'
/**
 * 加载配置
 * @param lib 
 * @returns 
 */
export async function loadConfig(options: any) {
    return await store.dispatch('invokeNativeAction', {
        action: 'loadConfig',
        options
    })
}