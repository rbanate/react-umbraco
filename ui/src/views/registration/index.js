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
    margin: '20px auto',
  },
});

class Register extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <IdentityContext.Consumer>
        {context => {
          const { member } = context;
          if (member) return <Redirect to="/document-upload" />;
          return (
            <div className={classes.root}>
              <Grid container justify="center" alignItems="center" direction="column">
                <Grid item xs={12} lg={6}>
                  <Typography variant="title" align="center">
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Input your details below to Register. After submitting, you may upload your
                    Documents and View your Details
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <RegistrationForm onSubmit={context.setMemberInfo} />
                </Grid>
              </Grid>
            </div>
          );
        }}
      </IdentityContext.Consumer>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
