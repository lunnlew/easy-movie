<template>
    <el-dialog v-model="dialogVisible" title="增加资源库" @close="$emit('hide')">
        <el-form ref="form" :model="libform" label-width="120px">
            <el-form-item label="资源库名称">
                <el-input v-model="libform.name"></el-input>
            </el-form-item>
            <el-form-item label="目标文件夹">
                <el-input :disabled="true" v-model="libform.path" placeholder="请选择文件夹">
                    <template #append>
                        <el-button type="primary" @click="onSelectDirectory">选择</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="资源库类型">
                <el-select v-model="libform.type" placeholder="请选择资源库类型">
                    <el-option label="电影" value="movie"></el-option>
                    <!-- <el-option label="电视剧" value="tv"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="$emit('hide')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import {
    defineComponent,
    reactive,
    ref
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import { libMenuClick } from '@/lib/sideMenu';
export default defineComponent({
    name: "newLibDialog",
    emits: ["hide"],
    setup: (props, { emit }) => {
        const dialogVisible = ref(true)

        const libform = reactive({
            name: '',
            path: '',
            type: 'movie'
        })

        const store = useStore()

        async function onSubmit() {
            store.dispatch('addLib', libform).then((lib) => {
                dialogVisible.value = false
                emit('hide')
                libMenuClick(lib)
            })
        }
        async function onSelectDirectory() {
            const result = await store.dispatch('invokeMainAction', {
                action: 'showOpenDialog',
                options: {
                    title: '选择文件夹',
                    properties: ['openDirectory']
                }
            })
            libform.path = result.filePaths[0]
        }
        return {
            libform,
            onSubmit,
            onSelectDirectory,
            dialogVisible
        }
    }
})
</script>