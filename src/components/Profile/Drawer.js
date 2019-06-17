import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, withTheme, withStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';

// const drawerWidth = 240;

// const drawerStyles = theme => ({
//     root: {
//       display: 'flex',
//     //   zIndex: "2 !important",
//     //   top: '8vh',
//     },
//     // appBar: {
//     //   zIndex: theme.zIndex.drawer + 1,
//     //   transition: theme.transitions.create(['width', 'margin'], {
//     //     easing: theme.transitions.easing.sharp,
//     //     duration: theme.transitions.duration.leavingScreen,
//     //   }),
//     // },
//     // appBarShift: {
//     //   marginLeft: drawerWidth,
//     //   width: `calc(100% - ${drawerWidth}px)`,
//     //   transition: theme.transitions.create(['width', 'margin'], {
//     //     easing: theme.transitions.easing.sharp,
//     //     duration: theme.transitions.duration.enteringScreen,
//     //   }),
//     // },
//     menuButton: {
//       marginRight: 36,
//     },
//     hide: {
//       display: 'none',
//     },
//     drawer: {
//       width: drawerWidth,
//       flexShrink: 0,
//       whiteSpace: 'nowrap',
//     },
//     drawerOpen: {
//       width: drawerWidth,
//     //   transition: theme.transitions.create('width', {
//     //     easing: theme.transitions.easing.sharp,
//     //     duration: theme.transitions.duration.enteringScreen,
//     //   }),
//     },
//     drawerClose: {
//     //   transition: theme.transitions.create('width', {
//     //     easing: theme.transitions.easing.sharp,
//     //     duration: theme.transitions.duration.leavingScreen,
//     //   }),
//       overflowX: 'hidden',
//       width: theme.spacing(7) + 1,
//       [theme.breakpoints.up('sm')]: {
//         width: theme.spacing(9) + 1,
//       },
//     },
//     toolbar: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'flex-end',
//       padding: '0 8px',
//       ...theme.mixins.toolbar,
//     },
//     content: {
//       flexGrow: 1,
//       padding: theme.spacing(3),
//     },
// })

class ResponsiveDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        }
    }

    componentDidMount () {

        // if the screen is not mobile, set the state to open drawer
        // you shouldn't be able to close the drawer from an open one on desktop

        // on mobile, you should open to see the small drawer
        // then, you can click on the menu icon to open the full drawer
        // once you click an option, the drawer should close and then load that tab
        // profile will need some refactoring

    }

    handleDrawerOpen = () => {
        this.setState({
            open: true
        })
    }

    handleDrawerClose = () => {
        this.setState({
            open: false,
        })
    }

    render() {
        return (
            <Drawer
                variant="permanent"
                className={this.state.open ? "drawer drawer-open" : "drawer drawer-closed" }
                open={this.state.open}
            >
                <MediaQuery maxWidth={768}>
                    <div>
                        {this.state.open 
                            ? <IconButton onClick={this.handleDrawerClose} style={{ float: 'right' }}>
                                <ChevronLeftIcon />
                              </IconButton>
                            : <IconButton onClick={this.handleDrawerOpen}>
                                <ChevronRightIcon/>
                              </IconButton>
                        }
                    </div>
                    <Divider style={{ width: '100%' }}/>
                </MediaQuery>        

                <List>
                {['Edit Profile', 'Stats', 'Notification Settings', "Security"].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon><MailIcon /></ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
                ))}
                </List>
            </Drawer>
        )
    }
}

export default ResponsiveDrawer;