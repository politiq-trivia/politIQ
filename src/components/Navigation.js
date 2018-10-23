import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';

import AuthUserContext from './AuthUserContext';
import { auth } from '../firebase';

// UI stuff
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';

const Navigation = ({ authUser }) => {
  return (
    <AuthUserContext.Consumer>
      {authUser => authUser
        ? <NavigationAuth />
        : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  )
}

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
});


class NavigationAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: false,
    };
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }

  render() {
    const fullList = (
      <div>
        <List component="nav">
          <ListItem button component="a" href="/admin">
            <ListItemText primary="Admin Dashboard" />
          </ListItem>
          <ListItem button component="a" href="/home">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component="a" href="/play-game">
            <ListItemText primary="Play Game" />
          </ListItem>
          <ListItem button component="a" href="/quiz-archive">
            <ListItemText primary="Quiz Archive" />
          </ListItem>
          <ListItem button component="a" href="/leaderboard">
            <ListItemText primary="Leaderboard" />
          </ListItem>
          <ListItem button component="a" href="/profile">
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component="a" href="/about">
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button component="a" onClick={auth.doSignOut}>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div className={styles.root}>
        <AppBar position="static" className={styles.appBar}>
          <Toolbar>
            <Link to={routes.HOME}>
              <h3 style={{ color: 'white' }}>
                PolitIQ
              </h3>
            </Link>
            <div>
              <SwipeableDrawer
                classes={{ paper: styles.drawerPaper }}
                id="menu-appbar"
                anchororigin={{ vertical: 'top', horizontal: 'right' }}
                transformorigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={this.toggleDrawer('top', false )}
                anchor="top"
                open={this.state.top}
                onOpen={this.toggleDrawer('top', true )}
                style={{ marginTop: '1vh' }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer('top', false )}
                  onKeyDown={this.toggleDrawer('top', false )}
                >
                  {fullList}
                </div>
              </SwipeableDrawer>
            </div>
            <div style={{ marginLeft: 'auto', marginRight: '0' }}>
            <IconButton
              aria-haspopup='true'
              color="inherit"
              href="/profile"
            >
              <AccountCircle />
            </IconButton>
            <IconButton aria-label="Menu" color="inherit" onClick={this.toggleDrawer('top', true)} >
              <MenuIcon />
            </IconButton>
            </div>

          </Toolbar>
        </AppBar>
      </div>
    )
  }
}


class NavigationNonAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: false,
    };
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }

  render() {
    const fullList = (
      <div>
        <List component="nav">
          <ListItem button component="a" href="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component="a" href="/signin">
            <ListItemText primary="Sign In" />
          </ListItem>
          <ListItem button component="a" href="/play-game">
            <ListItemText primary="Play Game" />
          </ListItem>
          <ListItem button component="a" href="/about">
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div className={styles.root}>
        <AppBar position="static" className={styles.appBar}>
          <Toolbar>
            <Link to={routes.LANDING}>
              <h3 style={{ color: 'white' }} href="/">
                PolitIQ
              </h3>
            </Link>
            <div>
              <SwipeableDrawer
                classes={{ paper: styles.drawerPaper }}
                id="menu-appbar"
                anchororigin={{ vertical: 'top', horizontal: 'right' }}
                transformorigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={this.toggleDrawer('top', false )}
                anchor="top"
                open={this.state.top}
                onOpen={this.toggleDrawer('top', true )}
                style={{ marginTop: '1vh' }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer('top', false )}
                  onKeyDown={this.toggleDrawer('top', false )}
                >
                  {fullList}
                </div>
              </SwipeableDrawer>
            </div>
            <Button
              aria-haspopup='true'
              color="inherit"
              href="/signin"
              style={{ marginLeft: 'auto', marginRight: '0' }}
            >
              Login
            </Button>
            <IconButton aria-label="Menu" color="inherit" onClick={this.toggleDrawer('top', true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}


  export default Navigation;
