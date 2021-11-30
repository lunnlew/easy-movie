<template>
    <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
    </el-container>
</template>
<script lang="ts">
import {
    defineComponent
} from "vue";
export default defineComponent({
    name: "Setting",
    components: {},
    setup: (props, { emit }) => {
        console.log('setup')
    }
});
</script>
<style lang="less">
.el-container{
    height: 100%;
}
</style>