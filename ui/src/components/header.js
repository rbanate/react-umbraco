import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';

import Login from '../components/login';

import { IdentityContext } from '../ContextProvider';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
    };

    this.showHideLogin = this.showHideLogin.bind(this);
  }

  showHideLogin = () => {
    const { showLogin } = this.state;
    this.setState({ showLogin: !showLogin });
  };

  render() {
    const { classes } = this.props;
    const { showLogin } = this.state;

    /* eslint-disable */
    return (
      <IdentityContext.Consumer>
        {context => {
          const loggedIn = context.member !== undefined;
          return (<div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <Link className={classes.link} to="/"><HomeIcon /></Link>

                </IconButton>
                <Typography variant="title" color="inherit" className={classes.flex}>
                  Identity Portal
                </Typography>

               { loggedIn && (<Link className={classes.link} to="/document-upload"> <Button color="inherit" >
                Upload Documents
                </Button></Link>)
                }

                {!loggedIn && (
                <Button color="inherit" onClick={this.showHideLogin}>
                  Login
                </Button>)}
                {loggedIn && (
                  <Link className={classes.link} to="/profile" title="View Profile"><ProfileIcon /></Link>)
                }
              </Toolbar>
            </AppBar>
            {showLogin && <Login open={showLogin} onClose={this.showHideLogin} onSubmit={context.setMemberInfo} />}
          </div>)
        }}
      </IdentityContext.Consumer>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
