import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';

import AuthUserContext from './Auth/AuthUserContext';
import { auth, db } from '../firebase';

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

import Logo from './logo.png';

const Navigation = ({ authUser, signedInUser, clearStateOnSignout }) => {
  return (
    <AuthUserContext.Consumer>
      {authUser => authUser
        ? <NavigationAuth authUser={authUser} clearStateOnSignout={clearStateOnSignout}/>
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
    // marginBottom: '-17vh',
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
      mostRecentQuizURL: "",
      isAdmin: false,
    };
  }

  componentDidMount = () => {
    this.getMostRecentQuizId();
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }

  getMostRecentQuizId = async () => {
    await db.getQuizzes()
      .then(response => {
        if (response.val() !== null) {
          const data = response.val();
          const dateArray = Object.keys(data);
          const mostRecent = dateArray[dateArray.length-1]
          this.setState({
            mostRecentQuizURL: "quiz/" + mostRecent
          })
        }
      })
  }

  signOut = () => {
    auth.doSignOut()
    this.props.clearStateOnSignout()
    localStorage.removeItem('authUser')
    window.location.replace('/')
  }

  
  render() {
    const fullList = (
      <div>
        <List component="nav">
          {this.props.authUser && this.props.authUser.roles.includes("ADMIN") ?
          <Link to={routes.ADMIN_DASHBOARD} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Admin Dashboard" />
            </ListItem>
          </Link>
          : null }
          <Link to={this.state.mostRecentQuizURL} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Play Game" />
            </ListItem>
          </Link>
          <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Quiz Archive" />
            </ListItem>
          </Link>
          <Link to={routes.LEADERBOARD} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Leaderboard" />
            </ListItem>
          </Link>
          <Link to={routes.PROFILE} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
          <ListItem button component="a" onClick={this.signOut}>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div className={styles.root}>
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar>
            <Link to={routes.HOME} style={{ textDecoration: 'none' }}>
              <img src={Logo} alt="PolitIQ" style={{ height: '7vh', marginTop: '3px'}}/>
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
            <Link to={routes.PROFILE} style={{ textDecoration: 'none', color: 'white'}}>
              <IconButton
                aria-haspopup='true'
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Link>
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
    const playLink = () => {
      if (this.state.mostRecentQuizURL) {
        return (
          <Link to={this.state.mostRecentQuizURL} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Play Game" />
            </ListItem>
          </Link>
        )
      }
    }

    const fullList = (
      <div>
        <List component="nav">
          <Link to={routes.SIGN_IN} style={{ textDecoration: 'none'}}>
            <ListItem button>
              <ListItemText primary="Sign In" />
            </ListItem>
          </Link>
          {playLink()}
          <Link to={routes.ABOUT} style={{ textDecoration: 'none' }}>
            <ListItem button>
              <ListItemText primary="About" />
            </ListItem>
          </Link>
        </List>
      </div>
    );

    return (
      <div className={styles.root}>
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar>
            <Link to={routes.LANDING} style={{ textDecoration: 'none'}}>
              <img src={Logo} alt="PolitIQ" style={{ height: '7vh', marginTop: '3px'}}/>
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
            <Link to={routes.SIGN_IN} style={{ textDecoration: 'none', marginLeft: 'auto', marginRight: '0', color: 'white'}}>
              <Button
                aria-haspopup='true'
                color="inherit"
              >
                Login
              </Button>
            </Link>
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
