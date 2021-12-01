import store from "@/store";
export async function windowControl(command: string, options: any = {}) {
    store.dispatch('invokeNativeAction', {
        action: 'windowControl',
        command,
        options
    })
}