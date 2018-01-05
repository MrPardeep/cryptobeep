import Vue from 'vue';
import Router from '../router';
import constants from '../config/constants';

export {
  GetRequest,
  PostRequest,
  LoginAuthentication,
  NumberKeyValidation
};

function GetRequest(url, data) {
    return Vue.http.get(url)
      .then(response => {
          return response.data
      })
      .catch(error => {
        if(error.status === constants.STATUS_CODES.UNAUTHORIZED) {
          Router.push('/');
        } 
        return error;
      })
}
function PostRequest(url, postdata) {
    return Vue.http.post(url, postdata)
      .then(
        response => {
          if (response.body.status) {
             return {status : response.body.status, statustext : response.statusText, body : response.body.result};
          }
          else{
            return {status : response.body.status, statustext : response.body.error.msg};
          }
        })
      .catch(error => {
        if(error.status === constants.STATUS_CODES.UNAUTHORIZED) {
          Router.push('/');
        } 
        return error;
      })
}

function NumberKeyValidation(event) {
    let returnValue = (event.keyCode >= 48 && event.keyCode <= 57);
    return returnValue;
}
