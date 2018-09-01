import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

import { onChangeTriggerValidator } from '../utils/fieldValitors';
import ValidationType, { validationStatus } from '../utils/InputEnums';
import { validateUser, getMember } from '../utils/umbracoWrapper';

export default class Login extends React.Component {
  state = {
    form: {
      username: '',
      password: '',
    },
    validators: {
      username: validationStatus.Failed,
      password: validationStatus.Failed,
    },
    invalidUser: undefined,
    validForm: validationStatus.Failed,
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

  requriedFieldChange = (event, stateName, type, stateNameEqualTo) => {
    const { form, validators } = this.state;
    onChangeTriggerValidator(
      event,
      type,
      stateNameEqualTo,
      () => {
        validators[stateName] = validationStatus.Success;
      },
      () => {
        validators[stateName] = validationStatus.Failed;
      }
    );

    form[stateName] = event.target.value;
    this.validate(form, validators);
  };

  handleSubmit = () => {
    const { validForm, form} = this.state;
    const { onSubmit, onClose } = this.props;
    if(!validForm) return;
    validateUser(form).then(result => {
      const {validUser} = result.data;
      if(validUser) {
        getMember(form.username).then(response => {
           onSubmit(response.data.memberInfo);
           return onClose();
        }
        );
      } else {
        this.setState({invalidUser: true});
      }
    });

  };
  render() {
    const { open, onClose } = this.props;
    const{validators, validForm, invalidUser, form} = this.state;
    return (
      <div>
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="login-title">Login to Identity Portal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please input your username and password then click Login.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Email Address"
              type="email"
              value={form.username}
              error={validators.username === validationStatus.Failed}
              fullWidth
              required
              inputProps={{
                onChange: event =>
                  this.requriedFieldChange(event, event.target.id, ValidationType.Email, 5),
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="password"
              type="password"
              label="Password"
              value={form.password}
              error={validators.password === validationStatus.Failed}
              fullWidth
              inputProps={{
                onChange: event =>
                  this.requriedFieldChange(event, event.target.id, ValidationType.Length, 5),
              }}
            />
            {invalidUser && <Typography variant="body2" color="error">Invalid Username or password</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleSubmit} disabled={validForm === validationStatus.Failed}>
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Login.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
