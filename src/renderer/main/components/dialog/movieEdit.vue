<template>
    <el-dialog
        v-model="dialogVisible"
        :width="'70%'"
        :title="'影视编辑(' + item.name + ';' + item.year + ')'"
        @close="$emit('hide')"
    >
        <el-form ref="form" :model="libform" label-width="100px">
            <el-form-item label="影视名称">
                <el-input v-model="libform.name"></el-input>
            </el-form-item>
            <el-form-item label="发布年份">
                <el-date-picker v-model="libform.year" type="year" placeholder="请选择发布年份"></el-date-picker>
            </el-form-item>
            <el-form-item label="所在库">
                <el-select v-model="libform.media_lib_id" placeholder="请选择库">
                    <el-option label="默认库" value key="all"></el-option>
                    <el-option v-for="lib of libs" :label="lib.name" :value="lib.id" :key="lib.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="需要重新刮削">
                <el-switch v-model="libform.need_fetch"></el-switch>
            </el-form-item>
            <el-form-item style="text-align: right;margin-top: 20px;">
                <el-button type="primary" :loading="submitloading" @click="onSubmit">更新</el-button>
                <el-button @click="$emit('hide')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import { ElMessage } from "element-plus";
import {
    computed,
    defineComponent,
    reactive,
    ref
} from "vue";
import { useStore } from "vuex";
export default defineComponent({
    name: "movieEdit",
    components: {},
    emits: ["hide", "refresh"],
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    setup: (props, { emit }) => {
        const dialogVisible = ref(true)
        const store = useStore()

        const item = reactive(props.data)
        console.log(item)
        const libform = reactive({
            name: item.name,
            year: item.year,
            media_lib_id: item.media_lib_id,
            type: 'movie',
            need_fetch: false
        })

        async function onSubmit() {
            store.dispatch("movie_update", {
                old: {
                    ...props.data
                },
                new: {
                    ...libform
                }
            }).then((res) => {
                if (res.code == 200) {
                    ElMessage.success('更新成功')
                    emit("refresh", {
                        act: item.media_lib_id !== libform.media_lib_id ? "move" : "update",
                        item: {
                            id: item.id,
                            fid: item.fid,
                            ...libform
                        }
                    })
                } else {
                    ElMessage.error('更新失败')
                }
            })
        }
        const submitloading = ref(false)

        const libs = computed(() => store.state.Libs.libs.filter((lib: { name: string; }) => lib.name !== 'all'))
        return {
            onSubmit,
            libform,
            item,
            libs,
            dialogVisible,
            submitloading
        }
    }
})
</script>