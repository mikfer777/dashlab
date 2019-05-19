import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {sensorSocket} from "../actions/index";
import {connect} from "react-redux";


const mapDispatchToProps = dispatch => {
    return {
        sensorSocket: value => dispatch(sensorSocket(value))
    };
};

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
        height: 400,
        width: 500,
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

class XbeeDriver extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            query: 'idle',
            trans_period: '5',
            check_period: '60',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange = name => event => {
        console.log("handleChange event ==" + event);
        this.setState({[name]: event.target.value});
    };

    handleSubmit = event => {
        console.log("handleSubmit send websocket message =" + event.data);
        event.preventDefault();
        this.props.sensorSocket(JSON.stringify({
            type: 'xbeeprog',
            trans_period: new String(this.state.trans_period),
            check_period: new String(this.state.check_period)
        }));
    }

    render() {
        const {classes} = this.props;


        return (
            <Grid container className={classes.rootgrid} spacing={16}>
                {/*<Grid item xs>*/}
                {/*<Paper className={classes.paper}>xs</Paper>*/}
                {/*</Grid>*/}
                {/*<Grid item xs>*/}
                {/*<Paper className={classes.paper}>xs</Paper>*/}
                {/*</Grid>*/}
                {/*<Grid item xs>*/}
                {/*<Paper className={classes.paper}>xs</Paper>*/}
                {/*</Grid>*/}

                <Grid item xs>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h3">
                            XBEE module programmation
                        </Typography>
                        <Typography component="p">
                            Set the transmission period and the checking period in seconds
                        </Typography>

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="timer-native-simple">TransPeriod</InputLabel>
                            <Select
                                native
                                value={this.state.trans_period}
                                onChange={this.handleChange('trans_period')}
                                inputProps={{
                                    name: 'age',
                                    id: 'age-native-simple',
                                }}
                            >
                                <option value={5}>5s</option>
                                <option value={10}>10s</option>
                                <option value={60}>1min</option>
                                <option value={600}>10min</option>
                                <option value={3600}>1h</option>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="timer-native-simple">CheckPeriod</InputLabel>
                            <Select
                                native
                                value={this.state.check_period}
                                onChange={this.handleChange('check_period')}
                                inputProps={{
                                    name: 'age',
                                    id: 'age-native-simple',
                                }}
                            >
                                <option value={60}>1min</option>
                                <option value={600}>10min</option>
                                <option value={3600}>1h</option>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <form onSubmit={this.handleSubmit}>
                                <Button type="submit" variant="fab" color="primary" aria-label="Add">
                                    <AddIcon/>
                                </Button>
                            </form>
                        </FormControl>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const XbeeDriverForm = connect(null, mapDispatchToProps)(XbeeDriver);


XbeeDriver.propTypes = {
    classes: PropTypes.object.isRequired,
    sensorSocket: PropTypes.func.isRequired,
};

export default withStyles(styles)(XbeeDriverForm);

