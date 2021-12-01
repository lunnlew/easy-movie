<template>
    <el-dialog
        v-model="dialogVisible"
        :title="tip"
        width="400px"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="handleClose"
    >
        <span v-if="showUpdateTip == 1">发现新的版本需要更新。</span>
        <div
            v-else-if="showUpdateTip == 2 || showUpdateTip == 3"
            style="width: 100%;text-align: center;"
        >
            <el-progress :width="80" type="circle" :percentage="progress" />
        </div>
        <span v-else-if="showUpdateTip == 4">已经是最新版本了。</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">
                    <span>取消</span>
                </el-button>
                <el-button type="primary" @click="update" v-if="showUpdateTip == 1">确认更新</el-button>
                <el-button type="primary" @click="install" v-else-if="showUpdateTip == 3">确认安装</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import {
    defineComponent,
    ref,
    watch
} from "vue";
import { showUpdateTip, showUpdateCancel, replyUpdate, progress } from '@/lib/update'
export default defineComponent({
    name: "UpdateTip",
    components: {},
    emits: [],
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    setup: (props, { emit }) => {
        const dialogVisible = ref(true)
        const update = () => {
            if (replyUpdate.value) {
                replyUpdate.value({
                    ok: true
                })
            }
            showUpdateTip.value = 2
            progress.value = 0
        }
        const install = () => {
            if (replyUpdate.value) {
                replyUpdate.value({
                    ok: true
                })
            }
            showUpdateTip.value = 0
        }
        const cancel = () => {
            showUpdateTip.value = 0
            showUpdateCancel.value = true
            if (replyUpdate.value) {
                replyUpdate.value({
                    ok: false
                })
            }
        }
        const tip = ref('更新提示')
        watch(() => progress.value, (newValue) => {
            if (progress.value < 100) {
                tip.value = '正在下载更新包'
            } else {
                tip.value = '更新包下载完成'
            }
        })
        return {
            showUpdateTip,
            dialogVisible,
            progress,
            tip,
            update,
            install,
            cancel,
            handleClose() {
                dialogVisible.value = false;
            }
        };
    }
})
</script>