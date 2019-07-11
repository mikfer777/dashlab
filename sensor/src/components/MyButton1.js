import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import uuidv1 from "uuid";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {addNotifcounter, sensorSocket} from "../actions/index";
import DataProvider from './DataProvider';

import Table2 from './Table2';
import Table3 from './Table3';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";

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
        width: 300,
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

class MyButton1 extends Component {


    constructor() {
        super();

        this.state = {
            counterNotif: 0,
            type: 'notif'

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
    }

    handleChange(event) {
        console.log("handleChange event=" + event);
        this.setState({[event.target.id]: event.target.value});
    }

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
        console.log("handleSubmit2 send websocket message =" + event.data);
        event.preventDefault();
        this.props.sensorSocket(JSON.stringify({type: "start", name: "bob", age: 34, created: new Date()}));

    }

    render() {
        const {classes} = this.props;

        return (

            <Grid container className={classes.rootgrid} spacing={2}>
                <Grid item xs>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h3">
                            XBEE module table
                        </Typography>
                        <Typography component="p">
                            Send messages to channel
                        </Typography>

                        <FormControl className={classes.formControl}>
                            <form onSubmit={this.handleSubmit}>
                                <Button type="submit" variant="fab" color="primary" aria-label="Add">
                                    <AddIcon/>
                                </Button>
                            </form>
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
                <Grid item xs>
                    <Paper className={classes.paper2}>

                        {/*<DataProvider endpoint="/api/sensors/"*/}
                        {/*render={data => <Table3 data={data} />} />*/}
                        <DataProvider endpoint="/api/sensors/"
                                      render={data => <Table3 data={data}/>}/>


                    </Paper>
                </Grid>
            </Grid>

        );
    }
}

const MyButton1Form = connect(null, mapDispatchToProps)(MyButton1);

MyButton1.propTypes = {
    classes: PropTypes.object.isRequired,
    addNotifcounter: PropTypes.func.isRequired,
    sensorSocket: PropTypes.func.isRequired,
};


export default withStyles(styles)(MyButton1Form);

