import Axios from 'axios';
import UMBRACO_API from './constants';

export const checkIfEmailExists = email => {
  if (!email) return null;
  try {
    return Axios.get(`${UMBRACO_API}memberexists?username=${email}`).then(response => response);
  } catch (error) {
    console.log(error);
  }
};

export const registerMember = member => {
  if (!member) throw Error('Member information not set');
  try {
    return Axios.post(`${UMBRACO_API}createmember`, JSON.stringify(member), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(response => response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateMember = member => {
  if (!member) throw Error('Member information not set');
  try {
    return Axios.post(`${UMBRACO_API}updatemember`, JSON.stringify(member), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(response => response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const uploadDocuments = documents => {
  if (!documents) throw Error('Member information not set');
  try {
    return Axios.post(`${UMBRACO_API}UploadMemberDocuments`, JSON.stringify(documents), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(response => response);
  } catch (error) {
    console.log(error);
  }
};

export const validateUser = login => {
  if (!login) throw Error('Login information not set');
  try {
    return Axios.post(`${UMBRACO_API}validateuser`, JSON.stringify(login), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(response => response);
  } catch (error) {
    console.log(error);
  }
};

export const getMember = email => {
  if (!email) throw Error('Username information not set');
  try {
    return Axios.get(`${UMBRACO_API}getmember?email=${email}`).then(response => response);
  } catch (error) {
    console.log(error);
  }
};

export const testUpload = file => {
  if (!file) throw Error('Member information not set');
  console.log(JSON.stringify(file));
  try {
    return Axios.post(`${UMBRACO_API}docupload`, JSON.stringify(file), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(response => response);
  } catch (error) {
    console.log(error);
  }
};
