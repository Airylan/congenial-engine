import React, { useEffect } from 'react';
var ReactDOM = require('react-dom');
import { AppBar, Tabs, Tab, Typography, Box, CssBaseline, Grid, TextField, Paper } from '@material-ui/core';
import marked from 'marked';
var html = require('react-escape-html');
import { useTabs } from './tabstore';

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

    useEffect(() => { document.title = "Testing React App" });

    const active = state.currentTab;

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
    </>);
}

ReactDOM.render(<App />, document.querySelector('#root'));
