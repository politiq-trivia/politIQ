import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import TrendingUp from '@material-ui/icons/TrendingUp'
// import Notifications from '@material-ui/icons/Notifications';
import Settings from '@material-ui/icons/Settings';

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

        if (window.innerWidth < 768) {
            this.setState({
                open: false,
            })
        }
    }

    handleDrawerOpen = () => {
        this.setState({
            open: true
        })
    }

    handleDrawerClose = () => {
        if (window.innerWidth < 768) {
            this.setState({
                open: false,
            })
        }
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

                    <List style={{ paddingTop: '20px' }}>
                        <ListItem button onClick={() => {
                            this.props.toggleEditProfile()
                            this.handleDrawerClose()
                        }}>
                            <ListItemIcon><AccountCircle /></ListItemIcon>
                            <ListItemText primary={"Edit Profile"} />
                        </ListItem>
                        <ListItem button onClick={() => {
                            this.props.toggleShowStats()
                            this.handleDrawerClose()
                        }}>
                            <ListItemIcon><TrendingUp /></ListItemIcon>
                            <ListItemText primary={"Scores & Earnings"} />
                        </ListItem>
                        {/* <ListItem button onClick={() => {
                            this.props.toggleShowNotifications()
                            this.handleDrawerClose()
                        }}>
                            <ListItemIcon><Notifications /></ListItemIcon>
                            <ListItemText primary={"Notification Settings"} />
                        </ListItem> */}
                        <ListItem button onClick={() => {
                            this.props.toggleGameSettings()
                            this.handleDrawerClose()
                        }}>
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText primary={"Game Settings"} />
                        </ListItem>
                        <ListItem button onClick={() => {
                            this.props.toggleShowSecurity()
                            this.handleDrawerClose()
                        }}>
                            <ListItemIcon><Lock /></ListItemIcon>
                            <ListItemText primary={"Security"} />
                        </ListItem>
                    </List>
                </Drawer>
        )
    }
}

export default ResponsiveDrawer;