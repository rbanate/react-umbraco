import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';

import UploadDocuments from '../../components/uploadDocument';
import { IdentityContext } from '../../ContextProvider';
import MemberDetails from '../../components/memberProfile';

const styles = () => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    maxWidth: 800,
    margin: '20px auto',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  card: {
    minWidth: 275,
  },
  link: {
    textDecoration: 'none',
  },
  withTopMargin: {
    marginTop: '50px',
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
              <MemberDetails member={member} />
              <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                className={classes.withTopMargin}
              >
                <Grid item xs={12}>
                  {<UploadDocuments username={member.email} onSubmit={context.setMemberInfo} />}
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
