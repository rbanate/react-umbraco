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
  console.log(JSON.stringify(member));
  try {
    return Axios.post(`${UMBRACO_API}createmember`, JSON.stringify(member), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }).then(response => response);
  } catch (error) {
    console.log(error);
  }
};
