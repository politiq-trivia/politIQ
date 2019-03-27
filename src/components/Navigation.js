import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive'
 
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

import { auth, firebase } from '../firebase';
import { AuthUserContext, withAuthentication } from './Auth/index';
import * as routes from '../constants/routes';
import getMostRecentQuizId from '../utils/mostRecentQuizId';

import Logo from './logo1.png';

const Navigation = ({ clearStateOnSignout }) => {
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
      noQuizzes: false,
    };
  }

  componentDidMount = () => {
    this.getMostRecentQuizId();
    this.listener = firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    })
    if (localStorage.authUser) {
      const authUser = JSON.parse(localStorage.authUser)
      this.setState({
        signedInUser: authUser.uid,
        isAdmin: true
      })
    }
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }

  getMostRecentQuizId = async () => {
    const quizId = await getMostRecentQuizId()
    if (quizId === "No Available Quizzes") {
      this.setState({
        noQuizzes: true,
      })
    } else {
      this.setState({
        mostRecentQuizURL: quizId
      })
    }
  }

  signOut = () => {
    auth.doSignOut()
    this.props.clearStateOnSignout()
    localStorage.removeItem('authUser')
    window.location.replace('/')
  }

  
  render() {
    console.log(window.location.pathname.includes('/quiz'))
    const fullList = (
      <AuthUserContext.Consumer>
        {authUser => 
          <div>
            <MediaQuery query="(max-width: 415px)">
              <List component="nav">
                {authUser && authUser.roles.includes("ADMIN") ?
                <Link to={routes.ADMIN_DASHBOARD} style={{ textDecoration: 'none'}}>
                  <ListItem button>
                    <ListItemText primary="Admin Dashboard" />
                  </ListItem>
                </Link>
                : null }
                <Link to={this.state.mostRecentQuizURL} style={{ textDecoration: 'none'}}>
                  <ListItem button disabled={this.state.noQuizzes}>
                    <ListItemText primary={this.state.noQuizzes ? "No Available Quizzes" : "Play Game"} />
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
                <Link to={routes.SUBMIT_QUESTION} className="mobile-only" style={{ textDecoration: 'none'}}>
                  <ListItem button>
                    <ListItemText primary="Submit A Question"/>
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
            </MediaQuery>
            <MediaQuery query="(min-width: 416px)">
            <List component="nav">
                {this.props.authUser && this.props.authUser.roles.includes("ADMIN") ?
                <Link to={routes.ADMIN_DASHBOARD} style={{ textDecoration: 'none'}}>
                  <ListItem button>
                    <ListItemText primary="Admin Dashboard" />
                  </ListItem>
                </Link>
                : null }
                <Link to={this.state.mostRecentQuizURL} style={{ textDecoration: 'none'}}>
                  <ListItem button disabled={this.state.noQuizzes}>
                    <ListItemText primary={this.state.noQuizzes ? "No Available Quizzes" : "Play Game"} />
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
            </MediaQuery>
          </div>
        }
      </AuthUserContext.Consumer>
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

// const NavigationAuth = withAuthentication(NavigationAuthBase);


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
    return (
      <div className={styles.root}>
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar>
            <Link to={routes.LANDING} style={{ textDecoration: 'none' }}>
              <img src={Logo} alt="PolitIQ" style={{ height: '7vh', marginTop: '3px'}}/>
            </Link>
            <div style={{ width: '100%' }}>

              <Link to={routes.SIGN_UP} style={{ textDecoration: 'none', marginLeft: 'auto', marginRight: '0', color: 'white', float: 'right'}}>
                <Button
                  aria-haspopup='true'
                  color="inherit"
                >
                  Sign Up
                </Button>
              </Link>
              <Link to={routes.ABOUT} style={{ textDecoration: 'none', marginLeft: 'auto', marginRight: '0', color: 'white', float: 'right'}}>
                <Button
                  aria-haspopup='true'
                  color="inherit"
                >
                  About
                </Button>
              </Link>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}


  export default withAuthentication(Navigation);
