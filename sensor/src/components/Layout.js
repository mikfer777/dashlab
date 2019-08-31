import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import {MenuItem, MenuList} from "@material-ui/core";
import {Link, withRouter} from "react-router-dom";
import {compose} from "recompose";
import DraftsIcon from '@material-ui/icons/Drafts';
import Paper from '@material-ui/core/Paper';
import SendIcon from '@material-ui/icons/Send';
import Badge from "@material-ui/core/Badge/Badge";
import MailIcon from '@material-ui/icons/Mail';
import CameraRollIcon from '@material-ui/icons/CameraRoll';
import {connect} from "react-redux";
import NotificationsIcon from '@material-ui/icons/Notifications';

const drawerWidth = 400;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },

            primary: {
            },
            icon: {},
        },
    },
});


const mapStateToProps = state => {
    return { notifcounters: state.notifcounters,mailcounters: state.mailcounters,notifCAMcounters: state.notifCAMcounters };
};

class ConnectedLayout2 extends React.Component {
    state = {
        open: false,
    };

    handleDrawerOpen = () => {
        this.setState({open: true});

    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleBadge = () => {
        console.log("handleBadge");
        <Link component={Link} to="/sensor/foo">
            Simple case
        </Link>
    };

    render() {
        const {classes, location: {pathname}, children, theme} = this.props;
        const {open} = this.state;
        var mailcount = 0;
        var notifcount = 0;
        var notifCAMcount = 0;
        var x = this.props.notifcounters.length;
        console.log("demo props.. :x=" + x);
        var c = this.props.notifCAMcounters.length;
        console.log("demo props.. :c=" + c);
        var z = this.props.mailcounters.length;
        console.log("demo props.. :z=" + z);
        if (x > 0) {
            var y = this.props.notifcounters[x - 1];
            console.log("this.props.notifcounters[] :type=" + y.type);
            console.log("this.props.notifcounters[] :counter=" + y.counterNotif);
            if (y.type ==  'notif') {notifcount =  y.counterNotif}
        }
        if (z > 0) {
            var y = this.props.mailcounters[z - 1];
            console.log("this.props.mailcounters[] :type=" + y.type);
            console.log("this.props.mailcounters[] :counter=" + y.counterNotif);
            if (y.type ==  'mail') {mailcount =  y.counterNotif}
        }
        if (c > 0) {
            var y = this.props.notifCAMcounters[c - 1];
            console.log("this.props.notifCAMcounters[] :type=" + y.type);
            console.log("this.props.notifCAMcounters[] :counter=" + y.counterNotif);
            if (y.type ==  'cam') {notifCAMcount =  y.counterNotif + 1;
                // this.setState({notifCAMcounters[c]: notifCAMcount, type: 'cam'});
            }
        }
        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar disableGutters={!open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            DashBoard Lab
                        </Typography>
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit">
                                <Badge className={classes.margin} badgeContent={mailcount} max={9999} color="secondary" component={Link} to="/sensor/foo">
                                    <MailIcon/>
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge className={classes.margin} badgeContent={notifcount} color="secondary" component={Link} to="/sensor/demo"
                                    onClick={this.handleBadge}>
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge className={classes.margin} badgeContent={notifCAMcount} color="secondary" component={Link} to="/sensor/picam"
                                       onClick={this.handleBadge}>
                                    <CameraRollIcon/>
                                </Badge>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <Paper>
                        <MenuList>
                            <MenuItem className={classes.menuItem} component={Link} to="/sensor/bar"
                                      selected={'/sensor/bar' === pathname}>
                                <ListItemIcon className={classes.icon}>
                                    <SendIcon/>
                                </ListItemIcon>
                                <ListItemText classes={{primary: classes.primary}} inset primary="Doc en ligne et exemple de train"/>
                            </MenuItem>
                            <MenuItem className={classes.menuItem} component={Link} to="/sensor/foo" selected={'/sensor/foo' === pathname}>
                                <ListItemIcon className={classes.icon}>
                                    <DraftsIcon/>
                                </ListItemIcon>
                                <ListItemText classes={{primary: classes.primary}} inset primary="Labo"/>
                            </MenuItem>
                            <MenuItem className={classes.menuItem} component={Link} to="/sensor/demo" selected={'/sensor/demo' === pathname}>
                                <ListItemIcon className={classes.icon}>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText classes={{primary: classes.primary}} inset primary="Gestion de Table Material-table component"/>
                            </MenuItem>
                            <MenuItem className={classes.menuItem} component={Link} to="/sensor/xbeedrive" selected={'/sensor/xbeedrive' === pathname}>
                                <ListItemIcon className={classes.icon}>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText classes={{primary: classes.primary}} inset primary="Communication module Xbee Arduino"/>
                            </MenuItem>
                            <MenuItem className={classes.menuItem} component={Link} to="/sensor/trello" selected={'/sensor/trello' === pathname}>
                                <ListItemIcon className={classes.icon}>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText classes={{primary: classes.primary}} inset primary="Inbox"/>
                            </MenuItem>
                            <MenuItem className={classes.menuItem} component={Link} to="/sensor/picam" selected={'/sensor/picam' === pathname}>
                                <ListItemIcon className={classes.icon}>
                                    <InboxIcon/>
                                </ListItemIcon>
                                <ListItemText classes={{primary: classes.primary}} inset primary="RPI Zero Picam"/>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Drawer>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader}/>
                    {children}
                </main>
            </div>
        );
    }
}




const Layout = connect(mapStateToProps)(ConnectedLayout2);

Layout.propTypes = {
    notifcounters: PropTypes.array.isRequired,
    mailcounters: PropTypes.array.isRequired,
    notifCAMcounters: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default compose(
    withRouter,
    withStyles(styles, {withTheme: true})
)(Layout)