import React, {Component} from 'react';
import {getCountry} from './dataService';
import {
    Select,
    MenuItem, withStyles,
} from '@material-ui/core';
import PropTypes from "prop-types";

const styles = theme => ({


    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    width50: {
        width: '300px',
    },

});

class SimpleSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: getCountry(),
            selected: 'IN'

        };

        // this.handleChange1 = this.handleChange1.bind(this)
    }

    handleChange = event => {
        this.setState({selected: event.target.value, name: event.target.name});
    };

    renderOptions() {
        return this.state.data.map((dt, i) => {
            // console.log(dt);
            return (
                <option
                    value={dt.code} key={i} name={dt.name}>{dt.name}</option>

            );
        });
    }

    render() {
        // console.log(this.state.data);
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Select native className={classes.width50} value={this.state.selected} onChange={this.handleChange}>
                    {this.renderOptions()}
                </Select>
                <h3>Selected Country - {this.state.selected}</h3>
            </div>
        );
    }
}

//
// SimpleSelect.propTypes = {
//     classes: PropTypes.object.isRequired,
//
// };

export default withStyles(styles)(SimpleSelect);