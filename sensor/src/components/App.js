import React from "react";
import Layout from "./Layout";
import Bar from "./Bar";
import MyCompo from "./MyCompo";
import MyButton1 from "./MyButton1";
import Trello from "./Trello";
import Picam from "./PicamGrid";
import WebSock from "./WebSock";
import XbeeDriver from "./XbeeDriver";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import "./trello.css"


const theme = createMuiTheme({

    palette: {
        primary: {
            light: '#4ce853',
            main: '#847056',
            dark: '#e8791d',
            contrastText: '#fff6f8',
        },
        secondary: {
            light: '#ff7961',
            main: '#f4e723',
            dark: '#58baa4',
            contrastText: '#000',
        },
    },

    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});


const App = () => (
    <React.Fragment>
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <Layout>
                    <Switch>
                        <Route exact path="/sensor" render={() => <div>Home</div>}/>
                        <Route path="/sensor/bar" component={Bar}/>
                        <Route path="/sensor/foo" component={MyCompo}/>
                        <Route path="/sensor/demo" component={MyButton1}/>
                        <Route path="/sensor/xbeedrive" component={XbeeDriver}/>
                        <Route path="/sensor/trello" component={Trello}/>
                        <Route path="/sensor/picam" component={Picam}/>
                    </Switch>
                </Layout>
            </BrowserRouter>
            <WebSock/>
        </MuiThemeProvider>

    </React.Fragment>
);


export default App;

