import { createStore } from "vuex";
import InvokeAction from "./modules/invokeAction";
import Libs from "./modules/Libs";
import scraper from "./modules/scraper";
import Movie from "./modules/Movie";
import libScanView from "./modules/libScanView";
import libMenuView from "./modules/libMenuView";
const store = createStore({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        scraper,
        InvokeAction,
        Libs,
        Movie,
        libMenuView,
        libScanView
    }
});

store.dispatch('initActionEvent')

export default store;
