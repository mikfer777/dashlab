import React, {Component, PureComponent} from 'react';
import moment from 'moment';

import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import {addNotifcounter, sensorSocket} from "../actions/index";



const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        flexWrap: 'wrap',

    },
    button: {
        margin: theme.spacing.unit * 2,
    },
    placeholder: {
        height: 40,
    },

    paper: {
        height: 100,
        width: 500,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    paper2: {
        height: 10,
        width: 900,
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing.unit * 2,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    rootgrid: {
        flexGrow: 1,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

const mapDispatchToProps = dispatch => {
    return {
        addNotifcounter: value => dispatch(addNotifcounter(value)),
        sensorSocket: value => dispatch(sensorSocket(value))
    };
};

const mapStateToProps = state => {
    return {notifCAMcounters: state.notifCAMcounters};
};

class Chart1 extends PureComponent {

    constructor() {
        super();

        this.state = {
            uuid: '',
            data: []
        };

    }


    render() {
        const {classes} = this.props;
        // this.state.data = this.props.data;
        var c = this.props.notifCAMcounters.length;
        var smid = 0;
        var uuid = "";
        var payload = "";
        var ep = "";
        console.log("Chart1 props.. :c=" + c);
        if (c > 0) {
            var y = this.props.notifCAMcounters[c - 1];
            console.log("Chart1 this.props.notifCAMcounters[] :type=" + y.type);
            console.log("Chart1 this.props.notifCAMcounters[] :counter=" + y.counterNotif);
            smid = y.id;
            uuid = y.uuid;
            payload = y.payload;
            this.state.uuid = uuid;
            console.log("Chart1 this.props.notifCAMcounters[] :payload=" + payload.datetime);
            console.log("Chart1 this.props.notifCAMcounters[] :payload=" + payload.cpuload);
            this.state.data.push(payload)

        }
        var chartData=this.state.data;
        console.log("chartdata=" + chartData)
        return (
            <ResponsiveContainer width='95%' height='95%'>
                <ScatterChart>
                    <XAxis
                        dataKey='datetime'
                        // domain = {['auto', 'auto']}
                        name='DateTime'
                        tickFormatter={(unixTime) => moment(unixTime).format('HH:mm:ss')}
                        type='number'
                    />
                    <YAxis dataKey='cpuload' name='CPU load'/>

                    <Scatter
                        data={chartData}
                        line={{stroke: '#eee'}}
                        lineJointType='monotoneX'
                        lineType='joint'
                        name='Values'
                    />

                </ScatterChart>
            </ResponsiveContainer>
        );
    }
}

const ChartForm = connect(mapStateToProps, mapDispatchToProps)(Chart1);

Chart1.propTypes = {
    classes: PropTypes.object.isRequired,
    notifCAMcounters: PropTypes.array.isRequired,
    sensorSocket: PropTypes.func.isRequired,
    // data: PropTypes.array.isRequired,
};


export default withStyles(styles)(ChartForm);