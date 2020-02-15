import React, {Component} from 'react';
import {Select, withStyles,} from '@material-ui/core';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {addSelectedSensor} from "../actions/index";

const styles = theme => ({


    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',

    },
    width50: {
        width: '200px',
    },

});



const mapStateToProps = state => {
    return { notifSelectedSensors: state.notifSelectedSensors};
};

const mapDispatchToProps = dispatch => {
    return {
        addSelectedSensor: value => dispatch(addSelectedSensor(value))
    };
};

class SensorSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedSensor: "empty"
        };
        // for (var i = 0; i < this.props.notifSelectedSensors.length; i++) {
        //     console.log(this.props.notifSelectedSensors[i])
        //
        // }

        // this.handleChange1 = this.handleChange1.bind(this)
    }

    componentDidMount() {
        var url = '/api/sensormodules/'
        fetch(url)
            .then(resp => {
                if (resp.status !== 200) {
                    console.log("error on fetch " + url)
                }
                return resp.json();
            }).then(data => {
            let result = [];
            // console.log("fetch sensormodule" + data)
            for (var i = 0; i < data.length; i++) {
                // console.log(data[i])
                // result.push({name: data[i].name, code: data[i].sensor_uuid})
                result.push(data[i])
            }
            this.setState({data: result});
        })
    }

    handleChange = event => {
        this.setState({selectedSensor: event.target.value});
        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].sensor_uuid == event.target.value) {
                // console.log(this.state.data[i]);
                this.props.addSelectedSensor(this.state.data[i]);
                break;
            }
        }

    };

    renderOptions() {
        return this.state.data.map((dt, i) => {
            // console.log(dt);
            return (
                <option
                    value={dt.sensor_uuid} key={i} name={dt.name}>{dt.name}</option>

            );
        });
    }

    render() {
        // console.log(this.state.data);
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Select native className={classes.width50} value={this.state.selectedSensor}
                        onChange={this.handleChange}>
                    {this.renderOptions()}
                </Select>
                <h3>Selected Sensor Module - {this.state.selectedSensor}</h3>
            </div>
        );
    }
}


const SensorSelectorWidget = connect(mapStateToProps, mapDispatchToProps)(SensorSelector);

SensorSelector.propTypes = {
    addSelectedSensor: PropTypes.func.isRequired,
    notifSelectedSensors: PropTypes.array.isRequired
};


export default withStyles(styles)(SensorSelectorWidget);

