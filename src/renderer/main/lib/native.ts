import store from "@/store";
export async function windowControl(command: string, options: any = {}) {
    store.dispatch('invokeMainAction', {
        action: 'windowControl',
        command,
        options
    })
}