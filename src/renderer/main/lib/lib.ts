import { ElMessageBox } from "element-plus";
import { ref } from "vue";
import store from "@/store";
import router from "@/router";

/**
 * 是否显示新建媒体库对话框
 */
 export const isShowNewLibDialog = ref(false)

/**
 * 显示新建媒体库对话框
 */
export function showNewLibDialog() {
    isShowNewLibDialog.value = true
}

/**
 * 隐藏新建媒体库对话框
 */
 export function hideNewLibDialog() {
    isShowNewLibDialog.value = false
}

/**
 * 删除媒体库确认
 * @param lib 
 * @returns 
 */
 export async function removeLibConfirm(lib: any) {
    return new Promise<void>((resolve) => {
        ElMessageBox.confirm(
            '删除后，所有信息将转移到默认资料库中，是否继续?',
            '操作警告',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            store.dispatch('removeLib', lib)
            router.push({
                name: 'libitem',
                params: {
                    name: 'all'
                }
            })
            resolve()
        }).catch(() => {
            console.log('cancel')
            resolve()
        })
    })
}
