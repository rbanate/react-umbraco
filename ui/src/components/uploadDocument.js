import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import ReaderIcon from '@material-ui/icons/ChromeReaderModeRounded';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Dropzone from 'react-dropzone';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import { uploadDocuments, getMember } from '../utils/umbracoWrapper';

import ValidationType, { validationStatus } from '../utils/InputEnums';
import { onChangeTriggerValidator } from '../utils/fieldValitors';
import { OTHER_COUNTRIES } from '../utils/constants';

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
  formControl: {
    margin: theme.spacing.unit,
    marginTop: '-20px',
    width: '100%',
  },
  dropzone: {
    height: 50,
    borderWidth: 2,
    borderColor: 'rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    marginTop: '50px',
    cursor: 'default',
    textAlign: 'center',
    padding: '5px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  textField: {
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

  withBottomMargin: {
    marginBottom: '20px',
  },
});

const docTypes = [
  {
    value: 13,
    label: 'License',
  },
  {
    value: 14,
    label: 'Passport (Australian citizen)',
  },
  {
    value: 15,
    label: 'Passport (Other countries)',
  },
];

const getDocTypeLabel = value => {
  const selected = docTypes.find(option => option.value === value);
  return `Drag and Drop or select your ${selected.label} here`;
};

class UploadDocument extends React.Component {
  state = {
    form: {
      email: undefined,
      documentType: '',
      mandatoryDocuments: undefined,
      supportingDocuments: undefined,
      otherDocuments: undefined,
    },
    validators: {
      documentType: validationStatus.Failed,
      mandatoryDocuments: validationStatus.Failed,
      supportingDocuments: validationStatus.Success,
    },

    saving: false,
    submitted: false,
    error: false,
    validForm: validationStatus.Failed,
  };

  componentWillMount() {
    const { form } = this.state;
    const { username } = this.props;
    form.email = username;
    this.setState({ form: { ...form } });
  }

  onDropMandatoryDocs(files) {
    const { form, validators } = this.state;

    const evaludatedFiles = this.evaluatefiles(files);
    onChangeTriggerValidator(
      evaludatedFiles,
      ValidationType.ArrayLength,
      this.evaluatefiles,
      () => {
        validators.mandatoryDocuments = validationStatus.Success;
      },
      () => {
        validators.mandatoryDocuments = validationStatus.Failed;
      }
    );

    form.mandatoryDocuments = evaludatedFiles;
    this.setState({
      form: { ...form },
      validators: { ...validators },
    });
    setTimeout(() => {
      this.validate(form, this.state.validators);
    }, 10);
  }

  onDropopSupportingDocs(files) {
    const { form, validators } = this.state;

    const evaludatedFiles = this.evaluatefiles(files);
    onChangeTriggerValidator(
      evaludatedFiles,
      ValidationType.ArrayLength,
      this.evaluatefiles,
      () => {
        validators.supportingDocuments = validationStatus.Success;
      },
      () => {
        validators.supportingDocuments = validationStatus.Failed;
      }
    );

    form.supportingDocuments = evaludatedFiles;
    this.setState({
      form: { ...form },
      validators: { ...validators },
    });
    setTimeout(() => {
      this.validate(form, this.state.validators);
    }, 10);
  }

  evaluatefiles = files => {
    const acceptedFiles = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        // do whatever you want with the file content
        acceptedFiles.push({
          fileName: file.name,
          docType: file.type,
          base64: fileAsBinaryString,
        });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsDataURL(file);
    });
    return acceptedFiles;
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
      },
      () => {
        validators[stateName] = validationStatus.Failed;
        form[stateName] = event.target.value;
      }
    );
    if (
      stateName === 'documentType' &&
      event.target.value === OTHER_COUNTRIES &&
      !form.supportingDocuments
    ) {
      validators.supportingDocuments = validationStatus.Failed;
    } else {
      form.supportingDocuments = undefined;
      validators.supportingDocuments = validationStatus.Success;
    }
    this.validate(form, validators);
    this.setState({ form: { ...form }, validators: { ...validators } });
  };

  handleSubmit = () => {
    const { form, validators } = this.state;
    const { onSubmit } = this.props;

    this.validate(form, validators);
    const { validForm } = this.state;
    if (validForm === validationStatus.Success) {
      this.setState({ saving: true });
      uploadDocuments(form).then(result => {
        const { error } = result.data;
        if (error) {
          this.setState({ saving: false, validForm: false });
        } else {
          getMember(form.email)
            .then(response => {
              onSubmit(JSON.parse(response.data.memberInfo));
              return this.setState({ saving: false, submitted: true });
            })
            .catch(error => {
              this.setState({ error });
            });

          this.setState({ saving: false, submitted: true });
        }
      });
    }
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

  renderDocs = source => {
    if (!source) return null;

    const docs = source.map((doc, i) => (
      <Typography key={`doc-${i}`} variant="body2" color="primary">
        {doc.fileName}
      </Typography>
    ));
    return docs;
  };

  render() {
    const { classes } = this.props;
    const { form, saving, submitted, validForm, error } = this.state;
    const showSupportingDocs = form.documentType === OTHER_COUNTRIES;

    if (submitted) return <Redirect to="/profile" />;

    return (
      <Fragment>
        <div className={classes.root}>
          <div style={{ margin: '.5rem' }}>
            <Typography variant="title">Upload Documents</Typography>
            <Typography color="textSecondary" className={classes.withBottomMargin}>
              Select your preferred Document Type then Drag and Drop or select the files you wish to
              upload.{' '}
              <i>
                Note: Passport (Other Countries) - You may upload either Utility bill or Rent
                Receipt
              </i>{' '}
            </Typography>
          </div>
          <TextField
            select
            label="Document Type"
            id="documentType"
            name="documentType"
            value={form.documentType}
            className={classNames(classes.margin, classes.textField)}
            InputProps={{
              onChange: event =>
                this.requriedFieldChange(
                  event,
                  event.target.name,
                  ValidationType.Number,
                  undefined
                ),
              startAdornment: (
                <InputAdornment position="start">
                  <ReaderIcon />
                </InputAdornment>
              ),
            }}
          >
            {docTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {form.documentType && (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="mandatoryDocs">Mandatory Documents</InputLabel>
              <Dropzone
                id="mandatoryDocs"
                accept="application/pdf, image/jpeg, image/png"
                className={classes.dropzone}
                onDrop={acceptedFiles => this.onDropMandatoryDocs(acceptedFiles)}
              >
                <p>{getDocTypeLabel(form.documentType)}</p>
              </Dropzone>
              <FormHelperText component="div">
                {this.renderDocs(form.mandatoryDocuments)}
              </FormHelperText>
            </FormControl>
          )}
          {showSupportingDocs && (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="supportingDocs">Supporting Documents</InputLabel>
              <Dropzone
                id="supportingDocs"
                accept="application/pdf, image/jpeg, image/png"
                className={classes.dropzone}
                onDrop={acceptedFiles => this.onDropopSupportingDocs(acceptedFiles)}
              >
                <p>Drag and Drop your Utility bill or Rent receipt</p>
              </Dropzone>
              <FormHelperText component="div">
                {this.renderDocs(form.supportingDocuments)}
              </FormHelperText>
            </FormControl>
          )}
        </div>
        {error && (
          <Typography color="error" className={classes.margin}>
            An error has occured
          </Typography>
        )}
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="secondary"
            disabled={validForm === validationStatus.Failed}
            className={classes.buttonSuccess}
            onClick={this.handleSubmit}
          >
            {!saving ? (
              'Upload Documents'
            ) : (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
        </div>
      </Fragment>
    );
  }
}

UploadDocument.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(UploadDocument);
