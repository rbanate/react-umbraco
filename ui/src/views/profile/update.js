import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';

import UpdateProfileForm from '../../components/updateProfile';
import { IdentityContext } from '../../ContextProvider';

const styles = () => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    margin: '20px auto',
  },
});

class UpdateProfile extends React.Component {
  render() {
    const { classes } = this.props;
    console.log('what');
    return (
      <IdentityContext.Consumer>
        {context => {
          const { member } = context;
          if (!member) return <Redirect to="/" />;
          return (
            <div className={classes.root}>
              <Grid container justify="center" alignItems="center" direction="column">
                <Grid item xs={12} lg={6}>
                  <Typography variant="title" align="center">
                    Update your Personal Information
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Input your details below to Register. After submitting, you may upload your
                    Documents and View your Details
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <UpdateProfileForm member={member} onSubmit={context.setMemberInfo} />
                </Grid>
              </Grid>
            </div>
          );
        }}
      </IdentityContext.Consumer>
    );
  }
}

UpdateProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateProfile);
