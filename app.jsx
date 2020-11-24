import React, { useEffect } from 'react';
var ReactDOM = require('react-dom');
import { AppBar, Tabs, Tab, Typography, Box, CssBaseline, Grid, TextField, Paper } from '@material-ui/core';
import marked from 'marked';
var html = require('react-escape-html');
import { useTabs } from './tabstore';
import { useUserInfo } from './userstore';

import Amplify, { Auth, Hub } from 'aws-amplify';
import awsConfig from './aws-exports';

const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for production and second is for localhost
const [
    productionRedirectSignIn,
    localRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
    productionRedirectSignOut,
    localRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const updatedAwsConfig = {
    ...awsConfig,
    oauth: {
        ...awsConfig.oauth,
        redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
        redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
    }
}

Amplify.configure(updatedAwsConfig);

const Markdown = (props) => {
    const { value, ...other } = props;

    const sanitize = (text) => {
        return html`${text}`;
    };

    const sanitized = sanitize(value);

    return (<div dangerouslySetInnerHTML={{ __html: marked(sanitized.__html) }} {...other}></div>);
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const App = (props) => {
    const [state, { setCurrentTab, setMarkdown }] = useTabs();
    const [{ user }, { setUser, signIn, signOut, setCustomOAuthState }] = useUserInfo();

    useEffect(() => { document.title = "Testing React App" });

    const active = state.currentTab;

    const getUser = () => {
        return Auth.currentAuthenticatedUser()
            .then(userData => userData)
            .catch(() => console.log('Not signed in'));
    }

    useEffect(() => {
        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signIn":
                case 'cognitoHostedUI':
                    getUser().then(userData => signIn(userData));
                    break;
                case "signOut":
                    signOut();
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
                case "customOAuthState":
                    setCustomOAuthState(data);
            }
        });

        getUser().then(userData => setUser(userData));
    }, []);

    return (<>
        <CssBaseline/>
        <AppBar position="static">
            <Tabs value={active} onChange={(e, tab) => setCurrentTab(tab)}>
                <Tab label="First Tab" />
                <Tab label="Second Tab" />
                <Tab label="Third Tab" />
            </Tabs>
        </AppBar>
        {state.tabs.map((tab, index) => {
            return <TabPanel value={active} index={index}>
                <Typography variant="h1">{tab.title}</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Paper>
                            <TextField fullWidth multiline value={tab.value} onChange={(e) => setMarkdown(index, e.target.value)} />
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper>
                            <Markdown value={tab.value} />
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>;
        })}
        <div>
            <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
            {user ? (
                <button onClick={() => Auth.signOut()}>Sign Out</button>
            ) : (
                    <button onClick={() => Auth.federatedSignIn()}>Federated Sign In</button>
                )}
        </div>
    </>);
}

ReactDOM.render(<App />, document.querySelector('#root'));
