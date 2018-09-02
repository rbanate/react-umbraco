import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import { updateMember, getMember } from '../utils/umbracoWrapper';
import ValidationType, { validationStatus } from '../utils/InputEnums';
import { onChangeTriggerValidator } from '../utils/fieldValitors';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },

  textField: {
    flexBasis: 359,
  },
  textArea: {
    flexBasis: 735,
  },

  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
    textAlign: 'left',
    marginTop: '1rem',
    marginLeft: '.5rem',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[100],
  },
});

class UpdateProfileForm extends React.Component {
  state = {
    form: {},
    validators: {
      email: validationStatus.Success,
    },
    saving: false,
    submitted: false,
    validForm: validationStatus.Success,
  };

  componentWillMount() {
    const { firstname, lastname, email, dateOfBirth, address, passportNumber } = this.props.member;

    this.setState({
      form: {
        firstname,
        lastname,
        email,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : undefined,
        address,
        passportNumber,
        validForm: validationStatus.Success,
      },
    });
  }
  handleChange = (event, stateName) => {
    const { form } = this.state;
    form[stateName] = event.target.value;

    this.setState({ form: { ...form } });
  };

  handleSubmit = () => {
    const { form, validators } = this.state;
    const { onSubmit } = this.props;
    this.validate(form, validators);
    const { validForm } = this.state;
    if (validForm === validationStatus.Success) {
      this.setState({ saving: true });
      updateMember(form).then(result => {
        const { error } = result.data;
        if (error) {
          this.setState({ saving: false, validForm: false });
        } else {
          getMember(form.email).then(response => {
            onSubmit(JSON.parse(response.data.memberInfo));
            return this.setState({ saving: false, submitted: true });
          });
        }
      });
    }
  };

  requriedFieldChange = (event, stateName, type, stateNameEqualTo) => {
    const { form, validators } = this.state;
    onChangeTriggerValidator(
      event,
      type,
      stateNameEqualTo,
      () => {
        validators[stateName] = validationStatus.Success;
        form[stateName] = event.target.value;
        this.validate(form, validators);
      },
      () => {
        validators[stateName] = validationStatus.Failed;
        form[stateName] = event.target.value;
        this.validate(form, validators);
      }
    );
  };

  validate = (form, validators) => {
    const invalidFields = Object.keys(validators);
    let status = validationStatus.Success;
    /* eslint-disable */
    for (const field of invalidFields) {
      const value = validators[field];
      if (value === validationStatus.Failed) {
        status = validationStatus.Failed;
        break;
      }
    }
    /* eslint-enable */
    this.setState({ validators, form, validForm: status });
  };

  render() {
    const { classes } = this.props;
    const { validators, form, validForm, saving, submitted } = this.state;

    if (submitted) return <Redirect to="/profile" />;

    return (
      <Fragment>
        <div className={classes.root}>
          <TextField
            label="First name"
            id="firstname"
            value={form.firstname}
            autoFocus
            required
            placeholder="Input your First name"
            error={validators.firstname === validationStatus.Failed}
            className={classNames(classes.margin, classes.textField)}
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 2),
            }}
          />
          <TextField
            label="Last name"
            id="lastname"
            value={form.lastname}
            required
            placeholder="Input your Last name"
            error={validators.lastname === validationStatus.Failed}
            className={classNames(classes.margin, classes.textField)}
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 2),
            }}
          />

          <TextField
            label="Date of birth"
            type="date"
            id="dateOfBirth"
            value={form.dateOfBirth}
            defaultValue={form.dateOfBirth}
            placeholder="Input your birth date"
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            className={classNames(classes.margin, classes.textField)}
          />
          <TextField
            label="Address"
            id="address"
            multiline
            rows={3}
            rowsMax={3}
            fullWidth
            value={form.address}
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
            className={classNames(classes.margin, classes.textArea)}
          />

          <TextField
            label="Passport Number"
            id="passportNumber"
            value={form.passportNumber}
            required
            placeholder="Input your Passport number"
            error={validators.passportNumber === validationStatus.Failed}
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 8),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
        </div>
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.buttonSuccess}
            disabled={validForm === validationStatus.Failed}
            onClick={this.handleSubmit}
          >
            {saving ? (
              <CircularProgress size={24} className={classes.buttonProgress} />
            ) : (
              'Update Profile'
            )}
          </Button>
        </div>
      </Fragment>
    );
  }
}

UpdateProfileForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateProfileForm);
