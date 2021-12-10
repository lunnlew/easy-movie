<template>
    <div class="content-scroll-wrapper" ref="content" style="position: absolute;top:0">
        <div class="content-scroll">
            <div class="page-view">
                <!-- <div class="top-btns" v-if="libInfo.name !== 'all'">
                    <el-button
                        plain
                        size="small"
                        :loading="!!(scanInfo || {}).scan_loading"
                        @click.stop="scanLib(libInfo)"
                    >{{ scanTip }}</el-button>
                    <span class="lib-path" v-if="libInfo.name !== 'all'">位置: {{ libInfo.lib_path }}</span>
                </div> -->
                <movie-list ref="movie_list" :libInfo="libInfo"></movie-list>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {
    computed,
    defineComponent, onActivated, onMounted, ref, shallowRef, watch
} from "vue";
import MovieList from '@/components/movie/MovieList.vue'
import { onBeforeRouteUpdate } from "vue-router";
import { useStore } from "vuex";
import { scanLib } from "@/lib/scan";
export default defineComponent({
    name: "LibItem",
    components: { MovieList },
    setup: (props, { emit }) => {
        console.log('setup')
        const store = useStore()
        const libName = ref('all')
        const libInfo = computed(() => store.state.Libs.libs.find((lib: any) => lib.name === libName.value) || {})
        const scanInfo = computed(() => store.state.libScanView.libs.find((lib: any) => lib.lib_name === libName.value) || {})

        onBeforeRouteUpdate(async (to, from) => {
            console.log('onBeforeRouteUpdate', to, from)
            if (to.params.name !== from.params.name) {
                libName.value = to.params.name as any
            }
        })

        const movie_list = ref()

        const scanTip = ref("扫描")
        watch(() => scanInfo.value.scan_loading, (val) => {
            if (val) {
                scanTip.value = "扫描中..."
            } else {
                setTimeout(() => {
                    scanTip.value = "扫描"
                }, 3000)
            }
        })

        watch(() => scanInfo.value.update_ver, (val, oldval) => {
            if (val > oldval) {
                movie_list.value.update_movie(scanInfo.value.movie)
            }
        })

        const is_scroll_bottom_end = ref<boolean>(false)

        function updateScrollBottomEnd(dom: HTMLElement) {
            let offsetHeight = dom?.offsetHeight || 0
            let scrollTop = dom?.scrollTop || 0
            let scrollHeight = dom?.scrollHeight || 0
            saveScrollTop.value = scrollTop
            if (scrollHeight - (offsetHeight + scrollTop) <= 210) {
                if (!is_scroll_bottom_end.value) {
                    is_scroll_bottom_end.value = true
                    console.log('scroll bottom end')
                    store.commit('setScrollBottomEnd', true)
                }
            } else {
                if (is_scroll_bottom_end.value) {
                    is_scroll_bottom_end.value = false
                    store.commit('setScrollBottomEnd', false)
                }
            }
        }

        onMounted(async () => {
            content.value?.addEventListener('scroll', () => {
                updateScrollBottomEnd(content.value as HTMLElement)
            })
        })

        const content = shallowRef<HTMLElement>()

        const saveScrollTop = ref(0)
        onActivated(() => {
            console.log('onActivated')
            if (content.value) {
                content.value.scrollTop = saveScrollTop.value as number
            }
        })
        return {
            scanLib,
            scanInfo,
            scanTip,
            libInfo,
            movie_list,
            content
        }

    },
});
</script>
<style lang="less" scoped>
.lib-path {
    margin-left: 10px;
    color: #fff;
    font-size: 14px;
}
</style>