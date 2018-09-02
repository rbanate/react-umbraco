import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { NOT_SET } from '../utils/constants';

const styles = () => ({
  capitalize: {
    textTransform: 'capitalize',
  },
  card: {
    width: '98%',
    margin: 'auto',
  },
  link: {
    textDecoration: 'none',
  },
});

class DocumentUpload extends React.Component {
  render() {
    const { classes, member } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.capitalize}
          title={`Welcome ${member.firstname} ${member.lastname}`}
        />
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Email Address
          </Typography>
          <Typography gutterBottom>{member.email}</Typography>
          <Typography className={classes.pos} color="textSecondary">
            Date of Birth
          </Typography>
          <Typography gutterBottom>{member.dateOfBirth || NOT_SET}</Typography>
          <Typography className={classes.pos} color="textSecondary">
            Address
          </Typography>
          <Typography gutterBottom>{member.address || NOT_SET}</Typography>
          <Typography className={classes.pos} color="textSecondary">
            Passport Number
          </Typography>
          <Typography gutterBottom>{member.passportNumber}</Typography>
        </CardContent>
        <CardActions>
          <Link to="/update" className={classes.link}>
            <Button size="small" color="primary">
              Update Details
            </Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

DocumentUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
};

export default withStyles(styles)(DocumentUpload);
