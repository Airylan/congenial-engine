import { createStore, createHook } from 'react-sweet-state';
import { Storage } from 'aws-amplify';

const saveCurrentTabIfDirty = () => ({ getState, setState }) => {
    const state = getState();
    if (state.isDirty[state.currentTab]) {
        Storage.put(`${state.currentTab}.md`, state.tabs[state.currentTab].value, {
            level: 'private',
            contentType: 'text/plain'
        });
    }
    setState({
        isDirty: state.isDirty.map((v, index) => (index === state.currentTab) ? false : v)
    });
};

const pullTab = (tab) => ({ getState, setState }) => {
    Storage.get(`${tab}.md`, {
        level: 'private',
        contentType: 'text/plain',
        download: true,
        cacheControl: 'no-cache'
    }).then(mdfile => {
        mdfile.Body.text().then(md => {
            setState({
                tabs: getState().tabs.map((t, index) => (index === tab) ? { ...t, value: md } : { ...t }),
                isDirty: getState().isDirty.map((v, index) => (index === tab) ? false : v)
            });
        })
    }).catch(e => console.error(e));
}

const pullCurrentTab = () => ({ getState, dispatch }) => {
    const state = getState();
    dispatch(pullTab(state.currentTab));
}

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
        isDirty: [false, false, false],
        currentTab: 0
    },
    actions: {
        setMarkdown: (tab, md) => ({ getState, setState }) => {
            const state = getState();
            setState({
                tabs: state.tabs.map((t, index) => (index === tab) ? { ...t, value: md } : { ...t }),
                isDirty: state.isDirty.map((v, index) => (index === tab) ? true : v)
            });
        },
        setCurrentTab: (tab) => ({ setState, dispatch }) => {
            dispatch(saveCurrentTabIfDirty());
            setState({ currentTab: tab });
            dispatch(pullCurrentTab());
        },
        pullAllTabs: () => ({ getState, dispatch }) => {
            const tabs = getState().tabs;
            // there's probably a better way of doing this:
            tabs.forEach((tab, index) => dispatch(pullTab(index)));
        }
    }
});

export const useTabs = createHook(Store);