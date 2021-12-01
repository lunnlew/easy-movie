import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import PageLayout from "@/components/layout/pageLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: PageLayout,
        redirect: '/lib/all',
        children: [
            {
                path: '/detail/:movieId',
                name: 'MovieDetail',
                meta: { sort: 1, title: "影视详情", hidden: true, },
                component: () => import(/* webpackChunkName: "detail" */ '@/components/movie/MovieDetail.vue')
            },
            {
                path: '/lib/:name',
                name: 'libitem',
                meta: {
                    sort: 5,
                    title: "库",
                    hidden: true,
                    keepAlive: true
                },
                component: () => import(/* webpackChunkName: "Lib" */ '@/views/Lib/item.vue')
            }
        ]
    },
    {
        path: '/:pathMatch(.*)', name: 'not-found', component: () => import(/* webpackChunkName: "NotFound" */ '@/components/NotFound/index.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
