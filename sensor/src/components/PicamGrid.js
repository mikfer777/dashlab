import * as React from "react";
import {Responsive, WidthProvider} from 'react-grid-layout';

// import GridLayout from 'react-grid-layout';
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import DataProvider from './DataProvider';
import TableSensorModule from './TableSensorModule';
import Picam from './Picam';
import {connect} from "react-redux";
import {addNotifcounter, sensorSocket} from "../actions";
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import MyCompo from './MyCompo'
import _ from "lodash";
import SimpleSelect from "./work";

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
        width: 1500


    },
    rootgrid: {
        flexGrow: 1,
    },


});


const ResponsiveGridLayout = WidthProvider(Responsive);

var harditems = [{i: '1', w: 3, h: 4, x: 0, y: 0, minW: 4, maxW: 4, minH: 4, maxH: 4, compo: 'picam'}];
var compArray = {picam: Picam, chart1: Chart1, chart2: Chart2};

const mapStateToProps = state => {
    return {notifCAMcounters: state.notifCAMcounters};
};


class PicamGrid extends React.Component {
    constructor(props) {
        super(props);
        let storedlayouts = getFromLS("picam1", "layouts") || {};
        let storeditems = getFromLS("picam2", "items") || harditems;
        saveToLS("picam2", "items", storeditems);
        this.state = {
            layouts: storedlayouts,
            items: storeditems,
            // items: [0, 1, 2, 3, 4].map(function (i, key, list) {
            //     return {
            //         i: i.toString(),
            //         x: i * 2,
            //         y: 0,
            //         w: 2,
            //         h: 2,
            //         compo: MyCompo,
            //         // add: i === (list.length - 1).toString()
            //     };
            // }),
            newCounter: 2
        }
        this.onAddItem = this.onAddItem.bind(this);
        this.onAddSM = this.onAddSM.bind(this);
        this.onBreakpointChange = this.onBreakpointChange.bind(this);
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
        this.setState({items: harditems, newCounter: 2});
        saveToLS("picam2", "items", harditems);
    }

    createElement(el) {
        const i = el.i;
        console.log("createElement i=", i);
        const {classes} = this.props;
        var mycompo = [];
        mycompo["id"] = compArray[el.compo];
        console.log("el.compo=", el.compo);
        switch (el.compo) {
            case 'sm':
                console.log("case TableSensorModule");
                return (
                    <div key={i} className={classes.paper2} data-grid={el}>
                        <Paper className={classes.paper2}>

                            {/*<DataProvider endpoint="/api/sensors/"*/}
                            {/*render={data => <Table3 data={data} />} />*/}
                            <DataProvider endpoint="/api/sensormodules/"
                                          render={data => <TableSensorModule data={data}/>}/>
                            <span className='react-resizable-cross' onClick={this.onRemoveItem.bind(this, i)}/>
                        </Paper>
                    </div>
                );
                break;
            default :
                console.log("case default");
                return (
                    <div key={i} className={classes.paper2} data-grid={el}>
                        {/*<span className="text">{i}</span>*/}
                        <span><mycompo.id/></span>
                        <span className='react-resizable-cross' onClick={this.onRemoveItem.bind(this, i)}/>
                    </div>
                );
        }
    }

    onAddItem() {
        /*eslint no-console: 0*/
        console.log("adding", "n" + this.state.newCounter);
        this.setState({
            // Add a new item. It must have a unique key!
            items: this.state.items.concat({
                i: "n" + this.state.newCounter,
                // x: (this.state.items.length * 2) % (this.state.cols || 12),
                x: 0,
                y: 0, // puts it at the bottom
                w: 4,
                h: 4,
                // minW: 4, maxW: 4, minH: 4, maxH: 4, static: false,
                compo: 'chart2',
            }),
            // Increment the counter to ensure key is always unique.
            newCounter: this.state.newCounter + 1
        });
    }

    onAddSM() {
        /*eslint no-console: 0*/
        console.log("adding", "n" + this.state.newCounter);
        this.setState({
            // Add a new item. It must have a unique key!
            items: this.state.items.concat({
                i: "n" + this.state.newCounter,
                x: 3,
                y: 0, // puts it at the bottom
                w: 9,
                h: 11,
                // minW: 4, maxW: 4, minH: 4, maxH: 4, static: false,
                compo: 'sm',
            }),
            // Increment the counter to ensure key is always unique.
            newCounter: this.state.newCounter + 1
        });
    }

    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    }

    onLayoutChange(layout, layouts) {
        saveToLS("picam1", "layouts", layouts);
        this.setState({layouts});
        console.log("set state layouts =" + JSON.stringify(this.state.layouts));
    }

    onRemoveItem(i) {
        console.log("removing", i);
        this.setState({items: _.reject(this.state.items, {i: i})});
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
        //
        saveToLS("picam2", "items", this.state.items);
        // {lg: layout1, md: layout2, ...}
        // var layouts = [
        //     {i: 'a', x: 0, y: 0, w: 1, h: 4, static: true},
        //     {i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 2, maxW: 4},
        //     {i: 'c', x: 1, y: 0, w: 5, h: 8}
        // ];
        return (
            <div>
                <button onClick={() => this.resetLayout()}>Reset Layout</button>
                <button onClick={this.onAddItem}>Add Item</button>
                <button onClick={this.onAddSM}>Show Sensor Modules</button>
                <span><SimpleSelect/></span>
                <ResponsiveGridLayout className="layout"
                                      rowHeight={40}
                                      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                                      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                                      layouts={this.state.layouts}
                                      onLayoutChange={(layout, layouts) =>
                                          this.onLayoutChange(layout, layouts)}
                                      onBreakpointChange={this.onBreakpointChange}
                                      {...this.props}
                >
                    {_.map(this.state.items, el => this.createElement(el))}
                    {/*<div key="5" className={classes.paper}*/}
                    {/*data-grid={{w: 3, h: 4, x: 0, y: 0, minW: 4, maxW: 4, minH: 4, maxH: 4, static: false}}>*/}
                    {/*<span><Picam/></span>*/}

                    {/*</div>*/}
                    {/*<div key="10" className={classes.paper2}*/}
                    {/*data-grid={{w: 8, h: 11, x: 4, y: 0, minW: 8, maxW: 8, minH: 11, maxH: 11}}>*/}
                    {/*<Paper className={classes.paper2}>*/}

                    {/*/!*<DataProvider endpoint="/api/sensors/"*!/*/}
                    {/*/!*render={data => <Table3 data={data} />} />*!/*/}
                    {/*<DataProvider endpoint="/api/sensormodules/"*/}
                    {/*render={data => <TableSensorModule data={data}/>}/>*/}
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
                    {/*<div key="5" className={classes.paper} data-grid={{w: 5, h: 7, x: 6, y: 0, static: false}}>*/}
                    {/*<span>*/}
                    {/*<Chart1/>*/}
                    {/*</span>*/}
                    {/*</div>*/}
                    {/*<div key="6" className={classes.paper} data-grid={{w: 5, h: 7, x: 1, y: 4, static: false}}>*/}
                    {/*<span>*/}
                    {/*<Chart2/>*/}
                    {/*</span>*/}
                    {/*</div>*/}

                </ResponsiveGridLayout>
            </div>

        )
    }


}


function getFromLS(gkit, key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem(gkit)) || {};
        } catch (e) {
            /*Ignore*/
        }
    }
    return ls[key];
}

function saveToLS(gkit, key, value) {
    if (global.localStorage) {
        global.localStorage.setItem(
            gkit,
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


