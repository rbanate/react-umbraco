import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import { Typography } from '@material-ui/core';

import { checkIfEmailExists, registerMember, getMember } from '../utils/umbracoWrapper';

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
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
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

class RegistrationForm extends React.Component {
  state = {
    form: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      dateOfBirth: '',
      address: '',
      passportNumber: '',
    },
    validators: {
      firstname: validationStatus.Failed,
      lastname: validationStatus.Failed,
      email: validationStatus.Failed,
      password: validationStatus.Failed,
      passportNumber: validationStatus.Failed,
    },
    emailExists: false,
    saving: false,
    submitted: false,
    error: false,
    validForm: validationStatus.Failed,
  };

  handleChange = (event, stateName) => {
    const { form } = this.state;
    form[stateName] = event.target.value;

    this.setState({ form: { ...form } });
  };

  handleKeydown = event => {
    if (event.keyCode === 9) {
      checkIfEmailExists(event.target.value)
        .then(result => {
          const { exists } = result.data;
          if (exists !== undefined) {
            this.setState({ emailExists: exists });
          }
        })
        .catch(error => this.setState({ error }));
    }
  };

  handleSubmit = () => {
    const { form, validators } = this.state;
    const { onSubmit } = this.props;
    this.validate(form, validators);
    const { validForm } = this.state;
    if (validForm === validationStatus.Success) {
      this.setState({ saving: true });
      registerMember(form)
        .then(result => {
          const { error } = result.data;
          if (error) {
            this.setState({ saving: false, validForm: false, emailExists: true });
          } else {
            getMember(form.email)
              .then(response => {
                onSubmit(JSON.parse(response.data.memberInfo));
                return this.setState({ saving: false, submitted: true });
              })
              .catch(error => {
                this.setState({ error });
              });
          }
        })
        .catch(error => this.setState({ error, saving: false, submitted: false }));
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
    const { validators, form, validForm, emailExists, saving, submitted, error } = this.state;

    if (submitted) return <Redirect to="/document-upload" />;

    return (
      <Fragment>
        <div className={classes.root}>
          <TextField
            label="First name"
            id="firstname"
            value={form.firstname}
            required
            placeholder="Input your First name"
            helperText="At lest 2 characters"
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
            helperText="At lest 2 characters"
            error={validators.lastname === validationStatus.Failed}
            className={classNames(classes.margin, classes.textField)}
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 2),
            }}
          />
          <TextField
            label="Email Address"
            type="email"
            id="email"
            value={form.email}
            placeholder="Input your Email address"
            helperText={emailExists ? 'Email already used' : undefined}
            error={validators.email === validationStatus.Failed || emailExists}
            required
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Email, 5),
              onKeyDown: event => this.handleKeydown(event),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
          <TextField
            label="Password"
            type="password"
            id="password"
            value={form.password}
            error={validators.password === validationStatus.Failed}
            helperText="At lest 10 characters"
            required
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 10),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
          <TextField
            label="Date of birth"
            type="date"
            id="dateOfBirth"
            value={form.dateOfBirth}
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
            helperText="At lest 8 characters"
            error={validators.passportNumber === validationStatus.Failed}
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 8),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
        </div>
        {error && (
          <Typography color="error" className={classes.margin}>
            An error has occured, please check your API endpoints
          </Typography>
        )}
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
              'Register'
            )}
          </Button>
        </div>
      </Fragment>
    );
  }
}

RegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(RegistrationForm);
