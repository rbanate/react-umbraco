import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { checkIfEmailExists, registerMember } from '../utils/umbracoWrapper';

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
    flexBasis: 300,
  },
  button: {
    textAlign: 'left',
    marginTop: '1rem',
  },
  asterisk: {
    color: 'red',
  },
});

class RegistrationForm extends React.Component {
  state = {
    form: {
      Firstname: '',
      Lastname: '',
      Email: '',
      Password: '',
      DateOfBirth: '',
      Address: '',
      PassportNumber: '',
    },
    validators: {
      Email: validationStatus.Failed,
      Password: validationStatus.Failed,
    },
    emailExists: false,
    validForm: validationStatus.Failed,
  };

  handleChange = (event, stateName) => {
    const { form } = this.state;
    form[stateName] = event.target.value;

    this.setState({ form: { ...form } });
  };

  handleKeydown = event => {
    if (event.keyCode === 9) {
      checkIfEmailExists(event.target.value).then(result => {
        const { exists } = result.data;
        this.setState({ emailExists: exists });
      });
    }
  };

  handleSubmit = () => {
    const { form, validators } = this.state;
    this.validate(form, validators);
    const { validForm } = this.state;
    if (validForm === validationStatus.Success) {
      registerMember(form).then(result => {
        console.log(result.data);
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

      this.setState({ validators, form, validForm: status });

  };

  render() {
    const { classes } = this.props;
    const { validators, form, validForm, emailExists } = this.state;
    return (
      <Fragment>
        <div className={classes.root}>
          <TextField
            label="First name"
            id="Firstname"
            value={form.Firstname}
            className={classNames(classes.margin, classes.textField)}
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
          />
          <TextField
            label="Last name"
            id="Lastname"
            value={form.Lastname}
            className={classNames(classes.margin, classes.textField)}
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
          />
          <TextField
            label="Email Address"
            type="email"
            id="Email"
            value={form.Email}
            placeholder="Input your Email address"
            helperText={emailExists ? "Email already used": undefined}
            error={validators.Email === validationStatus.Failed || emailExists}
            required
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Email, 5),
              onKeyDown: event => this.handleKeydown(event)
            }}
            className={classNames(classes.margin, classes.textField)}
          />
          <TextField
            label="Password"
            type="password"
            id="Password"
            value={form.Password}
            error={validators.Password === validationStatus.Failed}
            required
            inputProps={{
              onChange: event =>
                this.requriedFieldChange(event, event.target.id, ValidationType.Length, 5),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
          <TextField
            label="Date of birth"
            type="date"
            id="DateOfBirth"
            value={form.DateOfBirth}
            placeholder="Input your birth date"
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
          <TextField
            label="Address"
            id="Address"
            multiline
            rows={3}
            rowsMax={3}
            fullWidth
            value={form.Address}
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
            className={classNames(classes.margin)}
          />

          <TextField
            label="Passport Number"
            id="PassportNumber"
            value={form.PassportNumber}
            inputProps={{
              onChange: event => this.handleChange(event, event.target.id),
            }}
            className={classNames(classes.margin, classes.textField)}
          />
        </div>
        <div className={classes.button}>
          <Button variant="contained" color="secondary" disabled={validForm === validationStatus.Failed} onClick={this.handleSubmit}>
            Register
          </Button>
        </div>
      </Fragment>
    );
  }
}

RegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationForm);
