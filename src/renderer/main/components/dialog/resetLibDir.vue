<template>
  <el-dialog v-model="dialogVisible" title="资源库重定位" @close="close">
    <el-form ref="form" :model="libform" label-width="100px">
      <el-form-item label="资源库名称">
        <el-input size="medium" v-model="libform.name"></el-input>
      </el-form-item>
      <el-form-item label="原始文件夹">
        <el-input size="medium" :disabled="true" v-model="libform.path">
        </el-input>
      </el-form-item>
      <el-form-item label="新的文件夹">
        <el-input
          size="medium"
          :disabled="true"
          v-model="libform.newpath"
          placeholder="请选择文件夹"
        >
          <template #append>
            <el-button type="primary" @click="onSelectDirectory"
              >选择</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="资源库类型">
        <el-select
          size="medium"
          v-model="libform.type"
          placeholder="请选择资源库类型"
        >
          <el-option label="电影" value="movie"></el-option>
          <!-- <el-option label="电视剧" value="tv"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="onSubmit"
          >保存</el-button
        >
        <el-button size="medium" @click="$emit('hide')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "resetLibDir",
  emits: ["hide"],
  setup: (props, { emit }) => {
    const dialogVisible = ref(true);

    const store = useStore();

    const libinfo = computed(() => store.state.libMenuView.showResetLib);
    const libform = reactive({
      lib_id: libinfo.value.lib_id,
      name: libinfo.value.name,
      path: libinfo.value.path,
      newpath: "",
      type: "movie",
    });

    async function onSubmit() {
      if (libform.newpath) {
        await store.dispatch("changeLib", libform);
        store.commit("libMenuView/SET_RESETDIR_VIEW", {
          path: libform.newpath,
          lib_id: libform.lib_id,
          name: libform.name,
          show: false,
        });
      } else {
        store.commit("libMenuView/SET_RESETDIR_VIEW", {
          path: libform.path,
          lib_id: libform.lib_id,
          name: libform.name,
          show: false,
        });
      }
      dialogVisible.value = false;
    }
    async function onSelectDirectory() {
      const result = await store.dispatch("invokeMainAction", {
        action: "showOpenDialog",
        options: {
          title: "选择文件夹",
          properties: ["openDirectory"],
        },
      });
      libform.newpath = result.filePaths[0];
    }

    function close() {
      store.commit("libMenuView/SET_RESETDIR_VIEW", {
        path: libform.path,
        lib_id: libform.lib_id,
        name: libform.name,
        show: false,
      });
    }

    return {
      libform,
      onSubmit,
      close,
      onSelectDirectory,
      dialogVisible,
    };
  },
});
</script>