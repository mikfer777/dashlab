import * as React from "react";
import {Responsive, WidthProvider} from 'react-grid-layout';

// import GridLayout from 'react-grid-layout';
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import AddIcon from '@material-ui/icons/Add';
import Foo from "./Foo";
import Bar from "./Bar";
import XbeeDriver from "./XbeeDriver";
// import 'react-grid-layout/css/styles.css'
// import 'react-resizable/css/styles.css'
import DataProvider from './DataProvider';

import Table2 from './Table2';
import Table3 from './Table3';

const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    paper: {
        background: 'transparent',
        border: '2px solid #e2e2e2',
        borderRadius: 3,
        height: 100,
        width: 100

    },
    paper2: {

        background: 'transparent',
        border: '2px solid #e2e2e2',
        borderRadius: 3,
        height: 500,
        width: 500


    },
    rootgrid: {
        flexGrow: 1,
    },


});


const ResponsiveGridLayout = WidthProvider(Responsive);

class Trello extends React.Component {
    render() {
        const {classes} = this.props;
        // {lg: layout1, md: layout2, ...}
        var layouts = [
            {i: 'a', x: 0, y: 0, w: 1, h: 4, static: true},
            {i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 2, maxW: 4},
            {i: 'c', x: 1, y: 0, w: 5, h: 8}
        ];
        return (
            <ResponsiveGridLayout className="layout"
                                  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                  cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
                <div key="1" className={classes.paper} data-grid={{w: 4, h: 2, x: 0, y: 0, static: false}}>
                    <span>1</span>
                </div>
                <div key="2" className={classes.paper} data-grid={{w: 4, h: 2, x: 4, y: 0}}>
                    <span><Bar/></span>
                </div>
                <div key="3" className={classes.paper} data-grid={{w: 4, h: 2, x: 0, y: 2}}>
                    <span><Foo/></span>
                </div>
                <div key="4" className={classes.paper} data-grid={{w: 4, h: 2, x: 4, y: 4}}>
                    <Paper className={classes.paper2}>

                        {/*<DataProvider endpoint="/api/sensors/"*/}
                        {/*render={data => <Table3 data={data} />} />*/}
                        <DataProvider endpoint="/api/sensors/"
                                      render={data => <Table3 data={data}/>}/>


                    </Paper>
                </div>
                <div key="5" className={classes.paper2} data-grid={{w: 4, h: 2, x: 0, y: 6}}>
                    <span><XbeeDriver/></span>
                </div>


            </ResponsiveGridLayout>
        )
    }


}


// class Trello extends React.Component {
//     render() {
//         const {classes} = this.props;
//         // layout is an array of objects, see the demo for more complete usage
//         var layout = [
//             {i: 'a', x: 0, y: 0, w: 2, h: 4, static: true},
//             {i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 2, maxW: 4},
//             {i: 'c', x: 4, y: 0, w: 5, h: 8, minW: 5, maxW: 12}
//         ];
//         return (
//             <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
//                 <div key="a" className={classes.paper}>a</div>
//                 <div key="b" className={classes.paper}>b</div>
//                 <div key="c" className={classes.paper2}><XbeeDriver/></div>
//             </GridLayout>
//         )
//     }
// }

export class CustomComponent extends React.Component {
    render() {
        return (
            <div {...this.props} className={`wrapper ${this.props.className}`}>
                <Paper>
                    <Typography variant="h5" component="h3">
                        RaspberryPI Zero PICAM motion control
                    </Typography>
                    <Typography component="p">
                        Send messages to channel
                    </Typography>
                    <FormControl>
                        <form>
                            <Button type="submit" variant="fab" color="primary" aria-label="Add">
                                <AddIcon/>
                            </Button>
                        </form>
                    </FormControl>
                </Paper>
            </div>
        );
    }
}

Trello.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Trello);