// import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },

    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});


const mapStateToProps = state => {
    return { notifcounters: state.notifcounters,mailcounters: state.mailcounters };
};

class ConnectedPrimarySearchAppBar extends React.Component {




    render() {

        var mailcount = 0;
        var notifcount = 0;
        const { classes } = this.props;
        var x = this.props.notifcounters.length;
        console.log("demo props.. :x=" + x);
        var z = this.props.mailcounters.length;
        console.log("demo props.. :z=" + z);
        if (x > 0) {
            var y = this.props.notifcounters[x - 1];
            console.log("this.props.notifcounters[0] :type=" + y.type);
            console.log("this.props.notifcounters[0] :counter=" + y.counterNotif);
            if (y.type ==  'notif') {notifcount =  y.counterNotif}
        }
        if (z > 0) {
            var y = this.props.mailcounters[z - 1];
            console.log("this.props.mailcounters[0] :type=" + y.type);
            console.log("this.props.mailcounters[0] :counter=" + y.counterNotif);
            if (y.type ==  'mail') {mailcount =  y.counterNotif}
        }

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>

                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit">
                                <Badge className={classes.margin} badgeContent={mailcount} color="secondary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge className={classes.margin} badgeContent={notifcount} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton aria-haspopup="true" color="inherit">
                                <MoreIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

            </div>
        );
    }
}

const PrimarySearchAppBar = connect(mapStateToProps)(ConnectedPrimarySearchAppBar);

ConnectedPrimarySearchAppBar.propTypes = {
    notifcounters: PropTypes.array.isRequired,
    mailcounters: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired

};

export default withStyles(styles)(PrimarySearchAppBar);
