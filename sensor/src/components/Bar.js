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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

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
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
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
                   href="https://medium.com/the-andela-way/creating-a-django-api-using-django-rest-framework-apiview-b365dca53c1d">another
                    tutorial-api-django-rest-react</a><br/>
                <a target="_blank"
                   href="https://makina-corpus.com/blog/metier/2015/django-rest-framework-les-viewset-partie-2">Serializers
                    ViewSet</a><br/>


                <a target="_blank"
                   href="https://maurice-chavelli.developpez.com/tutoriels/nouveautes-es6/variables-et-fonctions/?page=es6-les-fonctions#LIII-C">es6-les-fonctions</a><br/>
                <a> redis server<br/>
                    react + redux<br/>
                    hot reload<br/></a>
                <a target="_blank"
                   href="https://material-ui.com/getting-started/installation/">material ui components</a><br/>
                <a target="_blank"
                   href="https://material-table.com/#/docs/get-started">material-table component</a><br/>
                <a target="_blank"
                   href="https://github.com/STRML/react-grid-layout">dynamic grid layout component</a><br/>
                <a target="_blank"
                   href="https://medium.com/@sonalsonu51/dnd-using-react-grid-layout-b45caa2c5ac1">using grid layout
                    component</a><br/>
                <a target="_blank"
                   href="http://recharts.org/en-US/examples/BarChartWithMultiXAxis">Recharts</a><br/>

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
        const bull = <span className={classes.bullet}>•</span>;

        return (
            <Grid container className={classes.rootgrid} spacing={16}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Stepper className={classes.paper} activeStep={activeStep} orientation="vertical">
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
                <Grid>
                    <Paper>
                        <Card className={classes.card}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Word of the Day
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    be{bull}nev{bull}o{bull}lent
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    adjective
                                </Typography>
                                <Typography variant="body2" component="p">
                                    well meaning and kindly.
                                    <br/>
                                    {'"a benevolent smile"'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
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
