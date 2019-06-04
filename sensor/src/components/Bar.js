import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from '@material-ui/core/Typography';

import Foo from "./Foo";
import XbeeDriver from "./XbeeDriver";

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
        height: 240,
        width: 1000,
        backgroundColor: 'transparent',
        boxShadow: 'none',


    },
});

function getSteps() {
    return ['try this tuto', 'set up arduino devops', 'Is it correct?'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return (<div><a target="_blank"
                            href="https://www.valentinog.com/blog/tutorial-api-django-rest-react/">tutorial-api-django-rest-react</a><br/>
                <a target="_blank"
                   href="https://maurice-chavelli.developpez.com/tutoriels/nouveautes-es6/variables-et-fonctions/?page=es6-les-fonctions#LIII-C">es6-les-fonctions</a><br/>
                <a> redis server<br/>
                    react + redux<br/>
                    hot reload<br/></a>
                <a target="_blank"
                   href="https://material-ui.com/getting-started/installation/">material ui components</a><br/>
                <a target="_blank"
                   href="https://material-table.com/#/docs/get-started">material-table component</a><br/>

            </div>);
        case 1:
            return (
                <div>why not ?
                </div>
            );
        case 2:
            return (<Foo/>);
        default:
            return 'Unknown step';
    }
}

class VerticalLinearStepper extends React.Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;

        return (
            <Grid container className={classes.rootgrid} spacing={16}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((label, index) => {
                                return (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            <Typography>{getStepContent(index)}</Typography>
                                            <div className={classes.actionsContainer}>
                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={this.handleBack}
                                                        className={classes.button}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.handleNext}
                                                        className={classes.button}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length && (
                            <Paper square elevation={0} className={classes.resetContainer}>
                                <Typography>All steps completed - you&apos;re finished</Typography>
                                <Button onClick={this.handleReset} className={classes.button}>
                                    Reset
                                </Button>
                            </Paper>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

VerticalLinearStepper.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);
