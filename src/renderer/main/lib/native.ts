import store from "@/store";
export async function closeApp() {
    const result = await store.dispatch('invokeNativeAction', {
        action: 'closeApp',
        options: {}
    })
    console.log(result)
    // const confirm = ElMessageBox.confirm('确定要关闭应用吗?', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // })
    // confirm.then(async () => {

    // }).catch(() => {
    //   console.log('取消关闭')
    // })
}