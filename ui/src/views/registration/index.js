import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';

import RegistrationForm from '../../components/registrationForm';
import { IdentityContext } from '../../ContextProvider';

const styles = () => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <IdentityContext.Consumer>
        {context => {
          const { member } = context;
          if (member) return <Redirect to="/document-upload" />;
          return (
            <div classes={classes.root}>
              <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                className={classes.root}
              >
                <Grid item xs={12} lg={6}>
                  <Typography variant="title">Personal Information</Typography>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <RegistrationForm />
                </Grid>
              </Grid>
            </div>
          );
        }}
      </IdentityContext.Consumer>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
