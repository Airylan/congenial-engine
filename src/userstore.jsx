import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
    initialState: {
        user: null,
        customState: null
    },
    actions: {
        setUser: (data) => ({ setState }) => {
            setState({ user: data });
        },
        signIn: (data) => ({ setState }) => {
            setState({ user: data });
        },
        signOut: (data) => ({ setState }) => {
            setState({
                user: null,
                customState: null // this isn't in the tutorial but ?
            });
        },
        setCustomOAuthState: (data) => ({ setState }) => {
            setState({
                customState: data
            });
        }
    }
});

export const useUserInfo = createHook(Store);