export default {
    namespaced: false,
    state() {
        return {
            addRouters: []
        }
    },
    mutations: {
        SET_ROUTERS: (state: { addRouters: any }, routers: any) => {
            state.addRouters = routers
        },
    },
    actions: {
    },
    getters: {
        getRouters: (state: { addRouters: any }) => state.addRouters
    }
}

