<template>
    <div class="not-found">
        <el-card>
            <el-button @click="$router.push('/')">返回</el-button>
        </el-card>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
} from "vue";
export default defineComponent({
    name: "NotFound",
    components: {},
});
</script>