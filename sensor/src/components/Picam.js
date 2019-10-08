import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuidv1 from "uuid";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {addNotifcounter, sensorSocket} from "../actions/index";
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


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

class Picam extends Component {


    constructor() {
        super();

        this.state = {
            counterNotif: 0,
            type: 'notif',
            uuid: '',
            sensor_command: 'stop'

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
    }

    handleChange = name => event => {
        console.log("handleChange event ==" + event);
        this.setState({[name]: event.target.value});
    };

    handleSubmit(event) {
        console.log("handleSubmit hot-reloaded event =" + event);
        event.preventDefault();
        var {counterNotif, type} = this.state;
        console.log("handleSubmit hot-reloaded counterNotif =" + counterNotif);
        console.log("handleSubmit hot-reloaded type =" + type);
        counterNotif = counterNotif + 1;
        const id = uuidv1();
        this.props.addNotifcounter({counterNotif, type, id});
        this.setState({counterNotif: counterNotif, type: 'notif'});

    }

    handleSubmit2(event) {
        console.log(event);
        event.preventDefault();
        this.props.sensorSocket(JSON.stringify({
            "sensor": {
                "type": "cmd",
                "uid": this.state.uuid
            },
            "payload": {
                created: new Date(),
                "data": this.state.sensor_command
            },
        }));

    }

    render() {
        const {classes} = this.props;
        var c = this.props.notifCAMcounters.length;
        var smid = 0;
        var uuid = "";
        var ep = "";
        console.log("picam props.. :c=" + c);
        if (c > 0) {
            var y = this.props.notifCAMcounters[c - 1];
            console.log("picam this.props.notifCAMcounters[] :type=" + y.type);
            console.log("picam this.props.notifCAMcounters[] :counter=" + y.counterNotif);
            smid = y.id;
            uuid = y.uuid;
            this.state.uuid = uuid;
            console.log("picam this.props.notifCAMcounters[] :id=" + smid);
            ep = '/api/sensormodules/' + smid + '/sensordata/';
        }
        return (

            <Grid container className={classes.rootgrid} spacing={2}>
                <Grid item xs>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h3">
                            RaspberryPI Zero PICAM motion control
                        </Typography>
                        <Typography component="p">
                            Send messages to channel {ep}
                        </Typography>

                        {/*<FormControl className={classes.formControl}>*/}
                            {/*<form onSubmit={this.handleSubmit}>*/}
                                {/*<Button type="submit" variant="fab" color="primary" aria-label="Add">*/}
                                    {/*<AddIcon/>*/}
                                {/*</Button>*/}
                            {/*</form>*/}
                        {/*</FormControl>*/}

                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="sensor-picam-co">Commande</InputLabel>
                            <Select
                                native
                                value={this.state.sensor_command}
                                onChange={this.handleChange('sensor_command')}
                                inputProps={{
                                    name: 'sensor_command',
                                    id: '"sensor-picam-co',
                                }}
                            >
                                <option value={'start'}>start</option>
                                <option value={'stop'}>stop</option>
                                <option value={'restart'}>restart</option>
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <form onSubmit={this.handleSubmit2}>
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

const PicamForm = connect(mapStateToProps, mapDispatchToProps)(Picam);

Picam.propTypes = {
    classes: PropTypes.object.isRequired,
    addNotifcounter: PropTypes.func.isRequired,
    notifCAMcounters: PropTypes.array.isRequired,
    sensorSocket: PropTypes.func.isRequired,
};


export default withStyles(styles)(PicamForm);

