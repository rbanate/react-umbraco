import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import { Redirect } from 'react-router-dom';

import DocumentsViewer from '../../components/documentViewer';
import { IdentityContext } from '../../ContextProvider';
import { getMember } from '../../utils/umbracoWrapper';

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

function ComplexGrid(props) {
  const { classes } = props;
  return (
    <IdentityContext.Consumer>
      {context => {
        const { member } = context;
        const notSet = 'not set';

        if (!context.member) return <Redirect to="/" />;
        console.log(member.MandatoryDocuments);
        return (
          <Paper className={classes.root}>
            <Grid container spacing={16}>
              <Grid item>
                {/* <ButtonBase className={classes.image}> */}
                <Avatar className={classes.image}>
                  <FolderIcon className={classes.image} />
                </Avatar>
                {/* </ButtonBase> */}
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={16}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subheading">
                      {`${member.Firstname} ${member.Lastname}`}
                    </Typography>
                    <Typography gutterBottom>Email: {member.Email}</Typography>
                    <Typography>Date of birth: {member.DateOfBirth || notSet}</Typography>
                    <Typography>Addres: {member.Address || notSet}</Typography>
                    <Typography>Passport: {member.PassportNumber || notSet}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography style={{ cursor: 'pointer' }}>Remove</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {member.MandatoryDocuments && (
              <DocumentsViewer title="Mandatory Documents" data={member.MandatoryDocuments} />
            )}
            {member.SupportingDocuments && (
              <DocumentsViewer title="Supporting Documents" data={member.SupportingDocuments} />
            )}
          </Paper>
        );
      }}
    </IdentityContext.Consumer>
  );
}

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplexGrid);
