import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';

import RegistrationForm from '../components/registrationForm';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;
    // if (!this.props.configured) return <Redirect to="/setup/welcome" />;

    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        className={classes.root}
      >
        <Grid item xs={12}>
          <Typography variant="title">Personal Information</Typography>
        </Grid>
        <Grid item xs={12}>
          <RegistrationForm />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
