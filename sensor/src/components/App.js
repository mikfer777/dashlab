import React from "react";
import Layout from "./Layout";
import Bar from "./Bar";
import Foo from "./Foo";
import MyButton1 from "./MyButton1";
import Trello from "./Trello";
import WebSock from "./WebSock";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#275982',
            main: '#216d39',
            dark: '#2f8424',
            contrastText: '#000',
        },
        secondary: {
            light: '#823c28',
            main: '#f5ff09',
            dark: '#ba000d',
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
                        <Route path="/sensor/foo" component={Foo}/>
                        <Route path="/sensor/demo" component={MyButton1}/>
                        <Route path="/sensor/trello" component={Trello}/>
                    </Switch>
                </Layout>
            </BrowserRouter>
        <WebSock/>
        </MuiThemeProvider>

    </React.Fragment>
);


export default App;

