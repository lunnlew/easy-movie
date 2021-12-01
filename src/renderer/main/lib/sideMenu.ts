import router from "@/router";
import { movie_lib } from "./movieFilter";

/**
 * 媒体库菜单点击
 * @param lib 
 * @returns 
 */
export const libMenuClick = (lib: any) => {
    movie_lib.value = lib;
    router.push({
        name: 'libitem',
        params: {
            name: lib.name
        }
    })
}