import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        margin: theme.spacing.unit * 2,
    },
    placeholder: {
        height: 40,
    },
    paper: {
        height: 240,
        width: 600,
        backgroundColor: 'transparent',
        boxShadow: 'none',


    },
    rootgrid: {
        flexGrow: 1,
    },
});


class MyCompo extends Component {

    constructor() {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            characterCount: 0,
            name: '',
            uuid: '',
            period: 0
        }
    }

    handleChange2 = name => event => {
        console.log("handleChange event ==" + event);
        this.setState({[name]: event.target.value});
    };

    handleChange(event) {
        console.log("handleChange event=" + event.target.value);
        this.setState({
            characterCount: event.target.value.length,
            name: event.target.value
        })
        console.log("props uuid =" + this.props.uuid);

    }

    render() {
        const {classes} = this.props;
        const name = this.state.name;
        console.log(this.props);
        console.log(this.state);
        this.state.uuid = 'XXX';
        return (
            <div className={classes.root}>
                <div>Hello! {name}</div>
                <TextField className="form-control" placeholder="Write a comment..." onChange={this.handleChange}/>
                <FormControl className={classes.formControl2}>
                    <InputLabel htmlFor="ipl">Periode</InputLabel>
                    <Select
                        native
                        value={this.state.period}
                        onChange={this.handleChange2('period')}
                        inputProps={{
                            name: 'period',
                            id: 'ipl',
                        }}
                    >
                        <option value={5}>5s</option>
                        <option value={10}>10s</option>
                        <option value={60}>1min</option>
                        <option value={600}>10min</option>
                        <option value={3600}>1h</option>
                    </Select>
                </FormControl>
            </div>
        )
    }
}

MyCompo.defaultProps = {
    name: 'toto',
    uuid: 'XXXX'
};


MyCompo.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string
};

export default withStyles(styles)(MyCompo);