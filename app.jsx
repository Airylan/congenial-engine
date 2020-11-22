import React, { useEffect, useState } from 'react';
var ReactDOM = require('react-dom');
import { AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core';

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
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => { document.title = "Testing React App" });

    return (<>
        <AppBar position="static">
            <Tabs value={activeTab} onChange={(e, tab) => setActiveTab(tab)}>
                <Tab label="First Tab" />
                <Tab label="Second Tab" />
                <Tab label="Third Tab" />
            </Tabs>
        </AppBar>
        {["First Tab", "Second Tab", "Third Tab"].map((value, index) => {
            return <TabPanel value={activeTab} index={index}>
                <Typography variant="h1">{value}</Typography>
            </TabPanel>;
        })}
    </>);
}

ReactDOM.render(<App />, document.querySelector('#root'));
