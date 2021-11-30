import { createStore } from "vuex";
import NativeAction from "./modules/NativeAction";
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
        NativeAction,
        Libs,
        Movie,
        libMenuView,
        libScanView
    }
});

store.dispatch('initElectronEvent')

export default store;
