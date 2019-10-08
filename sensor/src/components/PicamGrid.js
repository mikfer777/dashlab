import * as React from "react";
import {Responsive, WidthProvider} from 'react-grid-layout';

// import GridLayout from 'react-grid-layout';
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import DataProvider from './DataProvider';
import TableRPIzero from './TableRPIzero';
import Picam from './Picam';
import {connect} from "react-redux";
import {addNotifcounter, sensorSocket} from "../actions";
import Chart1 from './Chart1'

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
var originalLayouts;


const mapStateToProps = state => {
    return {notifCAMcounters: state.notifCAMcounters};
};


class PicamGrid extends React.Component {
    constructor(props) {
        super(props);
        originalLayouts = getFromLS("layouts") || {};
        console.log("originalLayouts =" + JSON.stringify(originalLayouts));
        this.state = {
            layouts: JSON.parse(JSON.stringify(originalLayouts))
        };
        console.log("state layouts =" + JSON.stringify(this.state.layouts));
    }

    static get defaultProps() {
        return {
            className: "layout",
            cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
            rowHeight: 30
        };
    }

    resetLayout() {
        this.setState({layouts: {}});
    }

    onLayoutChange(layout, layouts) {
        saveToLS("layouts", layouts);
        this.setState({layouts});
        console.log("set state layouts =" + JSON.stringify(this.state.layouts));
    }

    render() {
        const {classes} = this.props;
        var c = this.props.notifCAMcounters.length;
        var smid = 0;
        var uuid = "";
        var ep = "";
        if (c > 0) {
            var y = this.props.notifCAMcounters[c - 1];
            smid = y.id;
            uuid = y.uuid;
            console.log("picamgrid this.props.notifCAMcounters[] :id=" + smid);
            ep = '/api/sensormodules/' + smid + '/sensordata/';
        }
        // {lg: layout1, md: layout2, ...}
        // var layouts = [
        //     {i: 'a', x: 0, y: 0, w: 1, h: 4, static: true},
        //     {i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 2, maxW: 4},
        //     {i: 'c', x: 1, y: 0, w: 5, h: 8}
        // ];
        return (
            <div>
                <button onClick={() => this.resetLayout()}>Reset Layout</button>
                <ResponsiveGridLayout className="layout"
                                      rowHeight={60}
                                      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                                      layouts={this.state.layouts}
                                      onLayoutChange={(layout, layouts) =>
                                          this.onLayoutChange(layout, layouts)
                                      }>
                    <div key="1" className={classes.paper}
                         data-grid={{w: 3, h: 4, x: 0, y: 0, minW: 4, maxW: 4, minH: 4, maxH: 4, static: false}}>
                        <span><Picam/></span>
                    </div>
                    {/*<div key="2" className={classes.paper}*/}
                    {/*data-grid={{w: 6, h: 9, x: 3, y: 2, minW: 6, maxW: 6, minH: 9, maxH: 9}}>*/}
                    {/*<Paper className={classes.paper2}>*/}

                    {/*/!*<DataProvider endpoint="/api/sensors/"*!/*/}
                    {/*/!*render={data => <Table3 data={data} />} />*!/*/}
                    {/*<DataProvider endpoint={ep}*/}
                    {/*render={data => <TableRPIzero data={data}/>}/>*/}


                    {/*</Paper>*/}
                    {/*</div>*/}
                    {/*<div key="3" className={classes.paper} data-grid={{w: 2, h: 6, x: 0, y: 6, static: false}}>*/}
                        {/*<span>*/}
                        {/*<iframe id="iframe" src="http://192.168.1.34:8080" width="300" height="1000"*/}
                                {/*frameBorder="0"></iframe>*/}
                        {/*</span>*/}
                    {/*</div>*/}
                    {/*<div key="4" className={classes.paper} data-grid={{w: 4, h: 6, x: 0, y: 6, static: false}}>*/}
                        {/*<span>*/}
                        {/*<iframe id="iframe" src="http://192.168.1.34:8081" width="1280" height="720"*/}
                                {/*frameBorder="0"></iframe>*/}
                        {/*</span>*/}
                    {/*</div>*/}
                    <div key="5" className={classes.paper} data-grid={{w: 5, h: 7, x: 6, y: 0, static: false}}>
                        <span>
                        <Chart1/>
                        </span>
                    </div>

                </ResponsiveGridLayout>
            </div>

        )
    }


}


function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls[key];
}

function saveToLS(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem(
            "rgl-8",
            JSON.stringify({
                [key]: value
            })
        );
    }
}

PicamGrid.propTypes = {
    classes: PropTypes.object.isRequired,
    notifCAMcounters: PropTypes.array.isRequired,
};

const PicamGridForm = connect(mapStateToProps)(PicamGrid);

export default withStyles(styles)(PicamGridForm);


