import * as React from "react";
import {Responsive, WidthProvider} from 'react-grid-layout';

// import GridLayout from 'react-grid-layout';
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import DataProvider from './DataProvider';
import TableRPIzero from './TableRPIzero';
import Picam from './Picam';

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
        height: 420,
        width: 1000


    },
    rootgrid: {
        flexGrow: 1,
    },


});


const ResponsiveGridLayout = WidthProvider(Responsive);

class PicamGrid extends React.Component {
    render() {
        const {classes} = this.props;
        // {lg: layout1, md: layout2, ...}
        // var layouts = [
        //     {i: 'a', x: 0, y: 0, w: 1, h: 4, static: true},
        //     {i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 2, maxW: 4},
        //     {i: 'c', x: 1, y: 0, w: 5, h: 8}
        // ];
        return (
            <ResponsiveGridLayout className="layout"
                                  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                  cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
                <div key="1" className={classes.paper} data-grid={{w: 3, h: 2, x: 0, y: 0, static: false}}>
                    <span><Picam/></span>
                </div>
                <div key="2" className={classes.paper} data-grid={{w: 6, h: 3, x: 3, y: 2, minW:6, maxW: 6, minH:3,maxH: 3}}>
                    <Paper className={classes.paper2}>

                        {/*<DataProvider endpoint="/api/sensors/"*/}
                        {/*render={data => <Table3 data={data} />} />*/}
                        <DataProvider endpoint="/api/sensormodules/14/sensordata/"
                                      render={data => <TableRPIzero data={data}/>}/>


                    </Paper>
                </div>



            </ResponsiveGridLayout>
        )
    }


}


PicamGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PicamGrid);