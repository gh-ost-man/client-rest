export const authModule = {
    state: {
        user: null
    },
    mutations: {
        setUser(state, currentUser) {
            state.user = currentUser;
        }
    },
    namespaced: true
}