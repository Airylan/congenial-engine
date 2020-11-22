import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
    initialState: {
        tabs: [
            {
                title: "Tab one",
                value: "Sample md."
            },
            {
                title: "Tab two",
                value: "Sample md 2."
            },
            {
                title: "Tab three",
                value: ""
            }
        ],
        currentTab: 0
    },
    actions: {
        setMarkdown: (tab, md) => ({ getState, setState }) => {
            const state = getState();
            setState({ ...state, tabs: state.tabs.map((t, index) => (index === tab) ? { ...t, value: md } : { ...t }) });
        },
        setCurrentTab: (tab) => ({ setState }) => {
            setState({ currentTab: tab })
        }
    }
});

export const useTabs = createHook(Store);