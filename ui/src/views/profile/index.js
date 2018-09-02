import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import DocumentsViewer from '../../components/documentViewer';
import { IdentityContext } from '../../ContextProvider';
import MemberDetails from '../../components/memberProfile';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 800,
    padding: theme.spacing.unit * 2,
    margin: 'auto',
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

function Profile(props) {
  const { classes } = props;
  return (
    <IdentityContext.Consumer>
      {context => {
        const { member } = context;

        if (!context.member) return <Redirect to="/" />;
        return (
          <div className={classes.root}>
            <MemberDetails member={member} />

            {member.mandatoryDocuments && (
              <DocumentsViewer title="Mandatory Documents" data={member.mandatoryDocuments} />
            )}
            {member.supportingDocuments && (
              <DocumentsViewer title="Supporting Documents" data={member.supportingDocuments} />
            )}
          </div>
        );
      }}
    </IdentityContext.Consumer>
  );
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
