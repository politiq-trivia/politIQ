import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';
import Logo from '../logo1.ico';



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
  }
});

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
              <img src={Logo} alt="PolitIQ" style={{ height: '7vh', marginTop: '3px' }} />
            </Link>
            <div style={{ width: '100%' }}>

              <Link to={routes.SIGN_IN} style={{ textDecoration: 'none', marginLeft: 'auto', marginRight: '0', color: 'white', float: 'right' }}>
                <Button
                  aria-haspopup='true'
                  color="inherit"
                >
                  Sign In
                  </Button>
              </Link>
              <Link to={routes.ABOUT} style={{ textDecoration: 'none', marginLeft: 'auto', marginRight: '0', color: 'white', float: 'right' }}>
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

export default NavigationNonAuth;