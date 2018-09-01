import ValidationType from './InputEnums';

const verifyEmail = value => {
  const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRex.test(value)) {
    return true;
  }
  return false;
};

const verifyLength = (value, length) => {
  if (value.length >= length) {
    return true;
  }
  return false;
};

const compare = (string1, string2) => {
  if (string1 === string2) {
    return true;
  }
  return false;
};

const ArrayNotEmpty = source => {
  // console.log(!Array(source), Array(source).length !== 0);
  if (!Array(source) || Array(source).length === 0) return false;

  return Array(source).length !== 0;
};

const verifyNumber = value => {
  const numberRex = new RegExp('^[0-9]+$');
  if (numberRex.test(value)) {
    return true;
  }
  return false;
};
// verifies if value is a valid URL
const verifyUrl = value => {
  try {
    const url = new URL(value);
    return url;
  } catch (_) {
    return false;
  }
};

export const onChangeTriggerValidator = (
  event,
  type = ValidationType.Email,
  stateNameEqualTo,
  onValidValue,
  onInvalidValue
) => {
  switch (type) {
    case ValidationType.Email:
      if (verifyEmail(event.target.value)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    case ValidationType.Length:
      if (verifyLength(event.target.value, stateNameEqualTo)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    case ValidationType.Password:
      if (verifyLength(event.target.value, 1)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    case ValidationType.EqualTo:
      if (compare(event.target.value, stateNameEqualTo)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    case ValidationType.Number:
      if (verifyNumber(event.target.value)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    case ValidationType.Url:
      if (verifyUrl(event.target.value)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    case ValidationType.ArrayLength:
      if (ArrayNotEmpty(event)) {
        onValidValue();
      } else {
        onInvalidValue();
      }
      break;
    default:
      break;
  }
};
