import store from "@/store"

/**
 * 扫描库
 * @param lib 
 */
export function scanLib(lib: any) {
    if (lib) {
        store.dispatch("startScanLib", lib)
    } else {
        console.log("lib is null")
    }
}
