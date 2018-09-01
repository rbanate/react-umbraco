import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import UploadDocuments from '../../components/uploadDocument';
import { IdentityContext } from '../../ContextProvider';

const styles = () => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
  },
});

class DocumentUpload extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <IdentityContext.Consumer>
        {context => {
          const { member } = context;
          if (!member) return <Redirect to="/" />;
          return (
            <div className={classes.root}>
              <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                className={classes.root}
              >
                <Grid item xs={12} lg={4}>
                  <Typography variant="title">Upload Documents</Typography>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <UploadDocuments username={member.Email} />
                </Grid>
              </Grid>
            </div>
          );
        }}
      </IdentityContext.Consumer>
    );
  }
}

DocumentUpload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DocumentUpload);
