import {
    ref,
} from "vue";
export const showUpdateTip = ref(0);
export const showUpdateCancel = ref(false);
export const progress = ref(0)
export const needUpdateAlert = ref(false);
export const replyUpdate = ref<Function>();
export function changeShowUpdateTip(value: number, replay?: Function) {
    showUpdateCancel.value = false;
    showUpdateTip.value = value;
    replyUpdate.value = replay as any;
}
export function progressUpdate(value: number) {
    showUpdateTip.value = 2;
    progress.value = value;
}