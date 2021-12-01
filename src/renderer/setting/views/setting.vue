<template>
    <el-container>
        <el-header>
            <div class="header">
                <span>偏好设置</span>
                <div class="btn-group-right">
                    <div class="icon-btn-group" :style="{ width: '40px', textAlign: 'right' }">
                        <el-icon @click.stop="closeWindow">
                            <close />
                        </el-icon>
                    </div>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <ul class="menus">
                    <li>
                        <el-icon size="22">
                            <close />
                        </el-icon>
                        <span>常用</span>
                    </li>
                    <li>
                        <el-icon size="22">
                            <notification />
                        </el-icon>
                        <span>通知</span>
                    </li>
                    <li>
                        <el-icon size="22">
                            <Filter />
                        </el-icon>
                        <span>筛选</span>
                    </li>
                </ul>
            </el-aside>
            <el-main>
                <div class="main">
                    <div class="item">
                        主题
                        <ul class="theme">
                            <li v-for="(item, index) of themes" :key="index">
                                <div :style="item.style"></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="ts">
import {
    defineComponent
} from "vue";
import {
    Close,
    Filter,
    Notification
} from '@element-plus/icons'
import { windowControl } from '@/lib/native'
export default defineComponent({
    name: "Setting",
    components: { Close, Filter, Notification },
    setup: (props, { emit }) => {
        console.log('setup')
        function closeWindow() {
            console.log('closeWindow')
            windowControl('close')
        }
        const themes = [
            {
                style: {
                    background: '#409EFF'
                }
            },
            {
                style: {
                    background: '#ffffff'
                }
            },
            {
                style: {
                    background: '#4e5155'
                }
            }
        ]
        return {
            closeWindow,
            themes
        }
    }
});
</script>
<style lang="less">
.el-container {
    height: 100%;
}
.el-header {
    height: 39px;
    padding: 0;
}
.el-aside {
    background-color: #3b3b3b;
    color: #fff;
    border-right: 1px solid #333333;
}
.el-main {
    background-color: #434343;
    color: #fff;
}
.header {
    padding: 8px 20px 8px 30px;
    -webkit-app-region: drag;
    color: #fff;
    height: 39px;
    font-size: 14px;
    box-sizing: border-box;
    background-color: #353535;
    border-bottom: 1px solid #272727;
    .icon-btn-group {
        display: inline-block;
        cursor: pointer;
        position: relative;
    }
    .btn-group-right {
        display: inline-block;
        position: absolute;
        right: 10px;
    }
    .el-icon {
        padding: 5px;
        -webkit-app-region: no-drag;
        cursor: pointer;
        border-radius: 3px;
        &:hover {
            background: #d92424;
        }
        &.active {
            background: #d92424;
        }
    }
}
.menus {
    li {
        padding: 5px 15px;
        cursor: pointer;
        line-height: 32px;
        height: 32px;
        font-size: 14px;
        display: flex;
        align-items: center;
        &:hover {
            background: #d92424;
        }
        .el-icon {
            margin-right: 10px;
        }
    }
}
.main {
    font-size: 14px;
}
.item {
    padding: 10px 0;
}
.theme {
    list-style: none;
    padding: 10px 0;
    margin: 0;
    li {
        display: inline-block;
        width: 25px;
        height: 25px;
        margin: 0;
        padding: 0;
        cursor: pointer;
        border-radius: 3px;
        margin: 0;
        padding: 0;
        cursor: pointer;
        overflow: hidden;
        box-sizing: border-box;
        &:hover {
            border: 1px solid #66b1ff;
        }
        &.active {
            border: 1px solid #66b1ff;
        }
        div {
            border-radius: 3px;
            width: 25px;
            height: 25px;
        }
    }
    li + li {
        margin-left: 5px;
    }
}
</style>